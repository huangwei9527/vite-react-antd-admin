import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, Space } from 'antd'
import { cloneDeep } from 'lodash'
import FilterItemSearch from '@/components/filter-item-search'
import { formatMoney } from '@/utils/util'
import WrapperTable from '@/components/WrapperTable'
import { FilterItemCheckbox, FilterItemTabs } from '@/components/filter-item-components'

const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { filterParams, tableParams } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {
    dispatch(getTableData())
  }, [])

  const columns: any = [
    { dataIndex: 'number', title: '编码' },
    { dataIndex: 'name', title: '名称' },
    { dataIndex: 'date', title: '日期' },
    { dataIndex: 'dc', title: '借贷方向' },
    {
      dataIndex: 'amount',
      title: '金额',
      align: 'right',
      getValue: (record: any, _rowIndex: number) => {
        return formatMoney(record.amount, 2)
      }
    },
    { dataIndex: 'type', title: '类型' },
    { dataIndex: 'remark', title: '备注' }
  ]

  return (
    <div className={classnames('app-page1', styles.wrapper)}>
      <div className="app-page1-filter ">
        <div className={classnames('app-page1-filter-container', styles.filter)}>
          <div className="page1-filter-container">
            <Space size={12}>
              <FilterItemTabs
                value={filterParams.value1}
                options={pageConst.featureList}
                onChange={val => dispatch(getTableData({ value1: Number(val) }))}
              />
              <FilterItemCheckbox
                checked={filterParams.value2}
                label="显示现金类科目"
                onChange={val => dispatch(getTableData({ value2: Number(val) }))}
              />
            </Space>
          </div>
          <div className={classnames('app-page1-filter-container-btns', styles.btns)}>
            <Space>
              <Button type="primary">新增</Button>
              <Button>批量审核</Button>
              <Button>导出</Button>
            </Space>
          </div>
        </div>
      </div>
      <div className="app-page1-table">
        <WrapperTable primaryKey="id" isLoading={tableParams.loading} dataSource={tableParams.data} columns={columns} />
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
