import React, { FC, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Modal, Button, Checkbox } from 'antd'
import '@/components/dialogs/dialog-info/index.module.less'

export interface IProps {
  title?: string
  okText?: string
  top?: number // 原modal不支持设置top，这里top设置后的单位为vh
  cancelText?: string
  width?: number
  noFooter?: boolean
  noCancelBtn?: boolean // 不显示取消按钮
  checkboxLable: string
  visible?: boolean
  onOk?: (fn: (ok: boolean) => void, checkboxValue: boolean) => void // ok 为true表示异步成功， false 则失败
  onCancel?: (source?: string) => void // onCancel
  body?: string | JSX.Element
  remove?: () => void
  type?: string // success warning error info
  [key: string]: any
}

const Component: FC<IProps> = props => {
  const [visible] = useState(props.visible)
  const [loading, setLoading] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(true)

  const bodyStyle = {
    height: 'auto'
  }
  // 取消
  const handleModalCancel = (source?: string) => {
    props?.onCancel?.(source)
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
    }, checkboxValue)
  }
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
        <div style={{ flex: 1, paddingLeft: '20px' }}>
          <Checkbox checked={checkboxValue} onChange={e => setCheckboxValue(e.target.checked)}>
            {props.checkboxLable}
          </Checkbox>
        </div>
        <Button loading={loading} type="primary" onClick={handleSave}>
          {props.okText}
        </Button>
        {!props?.noCancelBtn && (
          <Button style={{ marginLeft: 12 }} onClick={() => handleModalCancel('footer-btn')}>
            {props.cancelText}
          </Button>
        )}
      </div>
    )
  }
  // body
  const renderBody = () => {
    return (
      <div className="k-dialog-body-text-info">
        <div>
          <i className="iconcool jinggao2 warning"></i>
        </div>
        <div>
          <p>{props.body}</p>
        </div>
      </div>
    )
  }
  return (
    <Modal
      className={`top_${props.top} ${props.querySelector || ''}`}
      title={props.title}
      bodyStyle={bodyStyle}
      footer={renderFooter()}
      height={props.height ? props.height : 200}
      keyboard={false}
      maskClosable={false}
      width={props.width}
      closable
      onCancel={() => handleModalCancel('close-icon')}
      mask
      visible={visible}
    >
      {renderBody()}
    </Modal>
  )
}

function DialogWithCheckbox(options: IProps) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  root.render(
    React.createElement(Component, {
      width: options.width || 460,
      title: '操作确认',
      okText: '确定',
      cancelText: '取消',
      ...options,
      visible: true,
      remove: () => {
        if (options.next) {
          options.next()
        }
        root.unmount()
        document.body.removeChild(div)
      }
    })
  )
}
export default DialogWithCheckbox
