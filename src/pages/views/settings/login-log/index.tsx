import React, { FC, useEffect } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, DatePicker, Space, Tooltip } from 'antd'
import dayjs from 'dayjs'
import FilterIterm from '@/components/filter-item'
import WrapperTable from '@/components/WrapperTable'
import FilterRefresh from '@/components/filter-refresh'
import FilterItemSearch from '@/components/filter-item-search'
const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { filterParams, tableParams } = useAppSelector(state => state[pageConst.PAGE_NAME])

  useEffect(() => {
    dispatch(getTableData())
  }, [])

  // 表格翻页
  const handlePageChange = (page: number, pageSize: number) => {
    dispatch(getTableData({ page, pageSize }))
  }

  const columns: any = [
    { dataIndex: 'signTs', title: '登录时间', width: 220 },
    { dataIndex: 'signName', title: '用户名称', width: 180 },
    { dataIndex: 'signAddr', title: '登录ip', width: 180 },
    { dataIndex: 'signType', title: '登录方式', width: 160 },
    { dataIndex: 'revision', title: '版本', width: 160 },
    {
      dataIndex: 'extInfo',
      title: '额外信息',
      ellipsis: {
        showTitle: false
      },
      render: extInfo => (
        <Tooltip placement="left" title={extInfo}>
          {extInfo}
        </Tooltip>
      )
    }
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
                  value={[dayjs(filterParams.startTs), dayjs(filterParams.endTs)]}
                  onChange={val => {
                    dispatch(
                      getTableData({
                        startTs: dayjs(val[0]).format('YYYY-MM-DD').toString(),
                        endTs: dayjs(val[1]).format('YYYY-MM-DD').toString()
                      })
                    )
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterItemSearch
                label="关键字"
                labelWidth={58}
                placeholder="请输入关键字搜索"
                value={filterParams.search}
                onSearch={() => dispatch(getTableData())}
                onChange={str => dispatch(setFilterParams({ search: str }))}
              />
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
