import React, { FC, ReactNode, useState } from 'react'
import { Button } from 'antd'
import classnames from 'classnames'
import './index.less'
interface IProps {
  leftJsx?: any // 左侧的筛选条件
  rightJsx?: any // 右侧的筛选条件
  filterItem?: any[] // 展开收起筛选条件
  filterItemExtend?: any // 展开收起筛选条件扩展，用于处理width=100%
  range?: any[]
  hasFilter: boolean // 是否有过滤条件
  disValue?: string // 组件显示的值
  dateRange?: any
  colNums?: number
  onSearch?: Function
  onReset?: Function
  onDateChange?: Function
  onChangeState?: Function
  className?: string
  CreateFilterIcon?: (hasFilter: boolean) => ReactNode
  [key: string]: any
}

const Fold: FC<IProps> = ({ colNums = 3, hasFilter = false, ...props }) => {
  const [show, setShow] = useState(false)
  // 打开折叠面板
  const handleDisClick = () => {
    props?.onChangeState?.(!show)
    setShow(pre => !pre)
  }
  // 收起折叠面板
  const handleHidden = () => {
    setShow(pre => !pre)
    props?.onChangeState?.(false)
  }
  // 搜索
  const handleSearch = () => {
    props?.onSearch?.()
    setShow(pre => !pre)
  }
  // 重置
  const handleReset = () => {
    props?.onReset?.()
  }

  // 渲染占位符，让框自动宽度永远均匀分布
  const renderSpace = () => {
    const length = props?.filterItem?.length
    if (length % colNums === 0) return null
    const spaceLength = colNums - (length % colNums)
    const spaceJSX = []
    for (let i = 0; i < spaceLength; i++) {
      spaceJSX.push(<div key={i} className="fold_container__showBox__content__foldItem"></div>)
    }
    return spaceJSX
  }

  return (
    <div className={'filter-fold_container ' + props?.className}>
      <div className="filter-fold_container__disBox">
        <div className="fold_container__disBox__leftJsx">{props?.leftJsx}</div>
        <div className={classnames('fold_container__disBox__leftJsx__disPanel', { show })}>
          <div className="fold_container__disBox__leftJsx__disPanel__valBox">{props.children}</div>
          <div className="fold_container__disBox__leftJsx__disPanel__iconBox" title="筛选" onClick={handleDisClick}>
            {/* 过滤 */}
            {props.CreateFilterIcon ? (
              props.CreateFilterIcon(hasFilter)
            ) : (
              <span className={`iconfont ${hasFilter ? 'icon-shaixuan' : 'icon-shaixuan1'}`} />
            )}
          </div>
        </div>
        <div className="fold_container__disBox__rightJsx">{props?.rightJsx}</div>
      </div>
      <div className={classnames('filter-fold_container__showBox', { show })}>
        <div className="fold_container__showBox__content">
          {props?.filterItem?.map((item, index) => (
            <div key={index} className="fold_container__showBox__content__foldItem">
              {item}
            </div>
          ))}
          {renderSpace()}
          {props?.filterItemExtend && (
            <div className="fold_container__showBox__content__foldItem_extend">{props?.filterItemExtend}</div>
          )}
        </div>
        <div className="fold_container__showBox__bottom">
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <div className="fold_container__showBox__bottom__holdUp" onClick={handleHidden}>
            收起
          </div>
        </div>
      </div>
    </div>
  )
}

export default Fold
