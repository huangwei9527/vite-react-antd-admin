import React, { FC, useEffect, useState, forwardRef, useRef } from 'react'
import { Table, Pagination } from 'antd'
import './index.less'
import classNames from 'classnames'

interface IProps {
  pageSize?: number
  pageSizeOptions?: number[]
  pageTotal?: number
  curPage?: number
  showCount?: boolean // 是否显示计数总条数  和分页互斥。用于不分页的页面显示当前列表条数
  totalCount?: number // 总条数
  selectedCount?: number // 已选条数
}

const noFun: any = () => {}
/**
 *  Table
 */
const Wrapper = ({ pageSize = 50, pageSizeOptions = ['50', '100', '200', '300', '500', '1000'], ...props }, ref) => {
  const [pageCurrent, setPageCurrent] = useState(1)
  const [statePageSize, setStatePageSize] = useState(pageSize)
  const [colSetIsGroup, setColSetIsGroup] = useState(false) // 是否是多表头 暂时只处理双表头情况

  const pageChange = (p: number, pz: number) => {
    setPageCurrent(p)
    setStatePageSize(pz)
    props?.onPageChange?.(p, pz)
  }
  const showSizeChange = (_current: number, pz: number) => {
    pageChange(1, pz)
  }

  const renderPagination = () => {
    if (props.pageTotal === undefined && !props.showCount) {
      return null
    }
    return (
      <div className="ag-table-pagination">
        <div className="ag-table-total-count">
          {props.showCount && (
            <>
              {props.selectedCount === undefined ? null : (
                <>
                  已选<span> {props.selectedCount || 0} </span>条 /
                </>
              )}
              共<span> {props.totalCount || 0} </span>条
            </>
          )}
        </div>
        {props.pageTotal !== undefined && (
          <Pagination
            onChange={pageChange}
            onShowSizeChange={showSizeChange}
            pageSize={statePageSize}
            current={pageCurrent}
            defaultCurrent={1}
            pageSizeOptions={pageSizeOptions}
            total={props.pageTotal}
            showSizeChanger
            showQuickJumper={false}
            simple={false}
            showTotal={total => `共 ${total} 条`}
          />
        )}
      </div>
    )
  }

  useEffect(() => {
    setColSetIsGroup(props.columns.filter(v => v.children?.length > 0).length > 0)
  }, [props.columns])

  useEffect(() => {
    setPageCurrent(props?.curPage || 1)
  }, [props.curPage])

  return (
    <div className={classNames('app-table-k-wrapper', { colSetIsGroup })}>
      <Table
        style={{
          flexGrow: 1,
          height: props.pageTotal === undefined && !props.showCount ? '100%' : `calc(100% - 44px)`
        }}
        {...(props as any)}
        bordered={true}
        pagination={false}
        columns={props.columns}
        onPageChange={noFun}
        scroll={{ x: '100%', y: '100%' }}
      />

      {renderPagination()}
    </div>
  )
}
export default forwardRef(Wrapper)
