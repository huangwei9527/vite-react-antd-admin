import React, { FC, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Modal, Button, Checkbox, Form, Input, Space, Radio, message } from 'antd'
import ProviderStoreComponent from '@/components/ProviderStoreComponent'
import { dictionaryStateConst } from '@/const'

export interface IProps {
  title?: string
  data?: any
  callback?: () => void
  [key: string]: any
}

const Component: FC<IProps> = props => {
  const [visible] = useState(props.visible)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    state: '1',
    remark: ''
  })
  useEffect(() => {
    if (props.data) {
      let newFormData = {
        id: props.data.id,
        name: props.data.name,
        code: props.data.code,
        state: props.data.state || '1',
        remark: props.data.remark
      }
      form.setFieldsValue({ ...newFormData })
      handleFormValueChange(newFormData)
    } else {
      form.setFieldsValue({ ...formData })
    }
  }, [])

  const handleFormValueChange = changedValues => {
    setFormData(pre => {
      return {
        ...pre,
        ...changedValues
      }
    })
  }
  // 取消
  const handleModalCancel = () => {
    props?.onCancel?.()
    props.remove()
  }
  // 确定
  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        setLoading(true)
        // apiEditDictionary(formData)
        //   .then(res => {
        //     if (props.callback) {
        //       props.callback()
        //     }
        //     props.remove()
        //   })
        //   .finally(() => {
        //     setLoading(true)
        //   })
      })
      .catch(() => {
        message.error('请完善表单！')
      })
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
      <Space>
        {!props?.noCancelBtn && (
          <Button style={{ marginLeft: 12 }} onClick={() => handleModalCancel()}>
            {props.cancelText}
          </Button>
        )}
        <Button loading={loading} type="primary" onClick={handleSave}>
          {props.okText}
        </Button>
      </Space>
    )
  }
  // body
  const renderBody = () => {
    return (
      <div>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 5 }}
          initialValues={{ remember: true }}
          onFieldsChange={handleFormValueChange}
        >
          <Form.Item label="字典名称" name="name" rules={[{ required: true, message: '字典名称不能为空' }]}>
            <Input placeholder="请输入字典名称" value={formData.name} />
          </Form.Item>
          <Form.Item label="字典编码" name="code" rules={[{ required: true, message: '字典编码不能为空' }]}>
            <Input placeholder="请输入字典编码" value={formData.code} />
          </Form.Item>
          <Form.Item label="状态" name="state" required>
            <Radio.Group value={formData.state}>
              {dictionaryStateConst.map(v => {
                return (
                  <Radio key={v.value} value={v.value}>
                    {v.label}
                  </Radio>
                )
              })}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" value={formData.remark} />
          </Form.Item>
        </Form>
      </div>
    )
  }
  return (
    <Modal
      className="commonDialogWrapper"
      title={props.title}
      footer={renderFooter()}
      keyboard={false}
      maskClosable={false}
      width={props.width}
      closable
      onCancel={handleModalCancel}
      mask
      open={visible}
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
    React.createElement(ProviderStoreComponent(Component), {
      width: options.width || 480,
      title: '编辑',
      okText: '确定',
      cancelText: '取消',
      ...options,
      visible: true,
      remove: () => {
        root.unmount()
      }
    })
  )
}
export default DialogWithCheckbox
