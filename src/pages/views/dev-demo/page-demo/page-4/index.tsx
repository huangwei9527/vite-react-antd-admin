import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import FilterCom from './component/filterCom'
import SplitPanelLayout from '@/components/SplitPanelLayout'
import styles from './index.module.less'
import classnames from 'classnames'
import { formatMoney } from '@/utils/util'
import WrapperTable from '@/components/WrapperTable'
import { cloneDeep } from 'lodash'
import FilterLeftTree from './component/filter-left-tree'

const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
  const { tableParams, siderPlacement } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {
    // 初始化搜索条件
    const fromPeriod = systemInitData.CURPERIOD
    const toPeriod = systemInitData.CURPERIOD
    dispatch(getTableData({ fromPeriod, toPeriod }))
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
        <SplitPanelLayout pageId={pageConst.PAGE_NAME} siderPlacement={siderPlacement} sider={<FilterLeftTree />}>
          <WrapperTable
            loading={tableParams.loading}
            dataSource={tableParams.data}
            columns={columns}
            onPageChange={handlePageChange}
            pageTotal={tableParams.total}
          />
        </SplitPanelLayout>
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
