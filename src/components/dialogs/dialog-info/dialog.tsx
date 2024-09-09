import React, { FC, useState, useEffect, useRef } from 'react'
import { Modal, Button } from 'antd'
import './index.module.less'

export interface IProps {
  title?: string
  okText?: string
  top?: number // 原modal不支持设置top，这里top设置后的单位为vh
  cancelText?: string
  width?: number
  noFooter?: boolean
  noCancelBtn?: boolean // 不显示取消按钮
  visible?: boolean
  onOk?: (fn: (ok: boolean) => void) => void // ok 为true表示异步成功， false 则失败
  onCancel?: (source?: string) => void // onCancel
  body?: string | JSX.Element
  remove?: () => void
  type?: 'success' | 'warning' | 'error' | 'info' // success warning error info
  dialogStyle?: any
  [key: string]: any
}

const FilterItem: FC<IProps> = props => {
  const [visible] = useState(props.visible)
  const [loading, setLoading] = useState(false)
  const refDialog = useRef(null)

  const bodyStyle = {
    height: 'auto'
  }
  // 取消
  const handleModalCancel = (source?: string) => {
    props?.onCancel?.(source)
    props?.onNext?.()
    props.remove()
  }
  // 确定
  const handleSave = e => {
    e.currentTarget.blur()
    setLoading(true)
    if (!props.onOk) {
      setLoading(false)
      props.remove()
      return
    }
    props.onOk((ok: boolean) => {
      setLoading(false)
      ok && props.remove()
    })
  }
  useEffect(() => {
    if (props.enterKey) {
      refDialog.current.focus()
    }
  }, [])

  // footer
  const renderFooter = () => {
    if (props?.noFooter) {
      return null
    }
    if (props?.footer) {
      return props.footer
    }
    return (
      <div className="k-dialog-footer-common">
        {!props?.noCancelBtn && <Button onClick={() => handleModalCancel('footer-btn')}>{props.cancelText}</Button>}
        <Button style={{ marginLeft: 12 }} loading={loading} type="primary" onClick={handleSave} ref={refDialog}>
          {props.okText}
        </Button>
      </div>
    )
  }
  // body
  const renderBody = () => {
    if (!props?.type) {
      return props.body as any
    }
    let iconClassName = 'iconfont'
    switch (props.type) {
      case 'success':
        iconClassName += ' icon-chenggong1 success'
        break
      case 'warning':
        iconClassName += ' icon-warning warning'
        break
      case 'error':
        iconClassName += ' icon-icon-warning error'
        break
      case 'info':
        iconClassName += ' icon-jinggao1 info'
        break
      default:
        iconClassName += ' icon-jinggao1 info'
        break
    }
    return (
      <div className="k-dialog-body-text-info">
        <div>
          <i className={iconClassName}></i>
        </div>
        <div>
          <p>{props.body}</p>
        </div>
      </div>
    )
  }
  return (
    <div
      onKeyPress={key => {
        if (props.enterKey && (key.code === 'Enter' || key.code === 'NumpadEnter')) {
          refDialog.current.blur()
          handleSave(key)
        }
      }}
    >
      <Modal
        className={`top_${props.top} ${props.querySelector || ''}`}
        title={props.title}
        styles={props.dialogStyle ? props.dialogStyle : bodyStyle}
        footer={renderFooter()}
        keyboard={true}
        maskClosable={false}
        width={props.width}
        closable
        onCancel={() => handleModalCancel('close-icon')}
        mask
        open={visible}
      >
        {renderBody()}
      </Modal>
    </div>
  )
}

export default FilterItem
