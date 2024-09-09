import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import FilterCom from './component/filterCom'
import styles from './index.module.less'
import classnames from 'classnames'
import { formatMoney } from '@/utils/util'
import WrapperTable from '@/components/WrapperTable'
import { cloneDeep } from 'lodash'

const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { filterParams, tableParams, siderPlacement } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {
    dispatch(getTableData({}))
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
      <div className="app-page1-filter ">
        <FilterCom />
      </div>
      <div className="app-page1-table">
        <WrapperTable
          primaryKey="id"
          isLoading={tableParams.loading}
          dataSource={tableParams.data}
          columns={columns}
          colSetColumnDefs={cloneDeep(columns)}
          colSetPageTag={pageConst.PAGE_TAG}
          onPageChange={handlePageChange}
          pageTotal={tableParams.total}
        />
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
