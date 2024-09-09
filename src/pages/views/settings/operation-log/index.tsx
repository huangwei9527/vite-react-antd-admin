import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, DatePicker, Input, Space } from 'antd'
import dayjs from 'dayjs'
import FilterIterm from '@/components/filter-item'
import WrapperTable from '@/components/WrapperTable'
import FilterRefresh from '@/components/filter-refresh'
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
    { dataIndex: 'datetime', title: '时间' },
    { dataIndex: 'username', title: '用户名' },
    { dataIndex: 'value1', title: '操作行为' },
    { dataIndex: 'value2', title: '备注1' },
    { dataIndex: 'value3', title: '备注2' },
    { dataIndex: 'remar', title: '备注3' }
  ]
  return (
    <div className={classnames('app-page1', styles.wrapper)}>
      <div className="app-page1-filter">
        <div className={classnames('app-page1-filter-container', styles.filter)}>
          <div className="page1-filter-container">
            <div className="inline-block marginR12">
              <FilterIterm label="日期" labelWidth={48}>
                <DatePicker.RangePicker
                  className="filter-iterm-input"
                  allowClear={false}
                  value={[dayjs(filterParams.dateFrom), dayjs(filterParams.dateTo)]}
                  onChange={val => {
                    dispatch(
                      getTableData({
                        dateFrom: dayjs(val[0]).format('YYYY-MM-DD hh:mm:ss').toString(),
                        dateTo: dayjs(val[1]).format('YYYY-MM-DD hh:mm:ss').toString()
                      })
                    )
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterIterm label="关键字" labelWidth={58}>
                <Input
                  className="filter-iterm-input"
                  allowClear={false}
                  value={filterParams.keywords}
                  placeholder="请输入关键字搜索"
                  onPressEnter={e => {
                    dispatch(getTableData({}))
                  }}
                  onChange={e => {
                    dispatch(setFilterParams({ keywords: e.target.value }))
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterRefresh onClick={() => dispatch(getTableData({}))} />
            </div>
          </div>
          <div className={classnames('app-page1-filter-container-btns', styles.btns)}>
            <Space>
              <Button type="primary">导出</Button>
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
