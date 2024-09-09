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
const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  })
}
const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { filterParams, tableParams } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {
    dispatch(getTableData())
  }, [])

  // 表格翻页
  const handlePageChange = (page: number, pageSize: number) => {
    dispatch(getTableData({ page, pageSize }))
  }

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
      <div className="app-page1-filter">
        <div className={classnames('app-page1-filter-container', styles.filter)}>
          <div className="page1-filter-container">
            <div className="inline-block">
              <FilterItemSearch
                placeholder="搜索编码/名称"
                value={filterParams.value3}
                onSearch={() => dispatch(getTableData())}
                onChange={str => dispatch(setFilterParams({ value3: str }))}
              />
            </div>
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
        <WrapperTable
          loading={tableParams.loading}
          dataSource={tableParams.data}
          columns={columns}
          onPageChange={handlePageChange}
          pageTotal={tableParams.total}
        />
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
