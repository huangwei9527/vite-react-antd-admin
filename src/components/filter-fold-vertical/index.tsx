import React, { FC, useState, useEffect, ReactNode } from 'react'
import { Button, Space } from 'antd'
import classnames from 'classnames'
import './index.less'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
interface IProps {
  leftJsx?: any // 左侧的筛选条件
  rightJsx?: any // 右侧的筛选条件
  filterItem?: any[] // 筛选条件
  filterMoreItem?: any[] // 更多的筛选条件
  hasFilter: boolean // 是否有过滤条件
  onSearch?: Function
  onReset?: Function
  className?: string
  CreateFilterIcon?: (hasFilter: boolean) => ReactNode
  onChangeState?: Function
  [key: string]: any
}
let timer = null

const FoldVertical: FC<IProps> = ({ hasFilter = false, ...props }) => {
  const [triggerShow, setTriggerShow] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [isWheel, setIsWheel] = useState(false)

  useEffect(() => {
    props?.onChangeState?.(triggerShow)
    const fn = () => {
      clearTimeout(timer)
      setIsWheel(true)
      timer = setTimeout(() => {
        setIsWheel(false)
      }, 400)
    }
    if (!triggerShow) {
      setShowMore(false)
    }
    if (triggerShow) {
      document.body.addEventListener('wheel', fn)
    } else {
      document.body.removeEventListener('wheel', fn)
    }
  }, [triggerShow])
  // 搜索
  const handleSearch = () => {
    props?.onSearch?.()
    setTriggerShow(pre => !pre)
  }
  // 重置
  const handleReset = () => {
    props?.onReset?.()
  }

  const handlerFilterClick = (e: any) => {
    setTriggerShow(p => !p)
  }

  const handleShadowClick = () => {
    setTriggerShow(false)
  }

  const handleShowMore = () => {
    setShowMore(p => !p)
  }

  const renderTriggerBox = () => {
    return (
      <div className={classnames('filter_fold_vertical_trigger_box', { more: showMore })}>
        <div className="filter_fold_vertical_trigger_content">
          {props?.filterItem?.map((item, index) => (
            <div key={index} className="filter_fold_vertical_trigger_content__foldItem">
              {item}
            </div>
          ))}

          {/* 展开更多 */}
          <div className="filter_fold_vertical_trigger_content_more">
            {props?.filterMoreItem?.map((item, index) => (
              <div key={index} className="filter_fold_vertical_trigger_content__foldItem">
                {item}
              </div>
            ))}
          </div>
          {/* end */}
        </div>
        <div className="filter_fold_vertical_trigger__bottom">
          <div>
            {props?.filterMoreItem?.length && (
              <Button type="text" onClick={handleShowMore}>
                {showMore ? '收起' : '展开'}更多
                {showMore ? <UpOutlined /> : <DownOutlined />}
              </Button>
            )}
          </div>
          <div>
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
            </Space>
          </div>
        </div>
      </div>
    )
  }

  const renderShadow = () => {
    if (isWheel) {
      return null
    }
    if (triggerShow) {
      return <div onClick={handleShadowClick} className="filter_fold_vertical_shadow"></div>
    }
    return null
  }

  return (
    <>
      <div className={'filter_fold_vertical_container ' + props?.className}>
        <div className="filter_fold_vertical_container__disBox">
          <div className="fold_vertical_container__disBox__leftJsx">{props?.leftJsx}</div>
          <div className={classnames('fold_vertical_container__disBox__leftJsx__disPanel', { show: triggerShow })}>
            <div className="fold_vertical_container__disBox__leftJsx__disPanel__valBox">{props.children}</div>

            <div onClick={handlerFilterClick} className="fold_vertical_container__disBox__leftJsx__disPanel__iconBox">
              {props.CreateFilterIcon ? (
                props.CreateFilterIcon(hasFilter)
              ) : (
                <>
                  <span className={`iconfont ${hasFilter ? 'icon-shaixuan' : 'icon-shaixuan1'}`} />
                  <span className="iconBox_txt">过滤</span>
                </>
              )}
            </div>
            {renderTriggerBox()}
          </div>
          <div className="fold_vertical_container__disBox__rightJsx">{props?.rightJsx}</div>
        </div>
      </div>
      {renderShadow()}
    </>
  )
}

interface IFoldVerticalItem {
  label: string | ReactNode
  labelWidth: number
  valueWidth?: number
  className?: string // 用来自定义边距，处理如一些下行小提示
  bottomTips?: string // 框下面的文字提示
  [key: string]: any
}
const FoldVerticalItem: FC<IFoldVerticalItem> = ({
  label = '',
  labelWidth = 50,
  className = '',
  bottomTips = '',
  valueWidth = 0,
  children
}) => {
  return (
    <div className={`fold_vertical_item_box ${bottomTips ? 'hasTip' : ''}` + className}>
      <div style={{ width: labelWidth }} className="fold_vertical_item_box_label">
        {label}：
      </div>
      <div style={{ width: valueWidth ? valueWidth : 294 - Number(labelWidth) }} className="fold_vertical_item_box_com">
        {children}
        {bottomTips && <div className="fold_vertical_item_box_com_tip">{bottomTips}</div>}
      </div>
    </div>
  )
}

export { FoldVertical, FoldVerticalItem }
