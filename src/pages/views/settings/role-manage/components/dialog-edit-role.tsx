import React, { FC, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Modal, Button, Checkbox, Form, Input, Space, Radio, message, Select, Switch } from 'antd'
import ProviderStoreComponent from '@/components/ProviderStoreComponent'
import { dictionaryStateConst, roleTypeConst } from '@/const'
import { apiAddRole, apiEditRole } from '../api'

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
    rid: '',
    roleName: '',
    roleType: '',
    roleDesc: '',
    tpyeDesc: '',
    states: true,
    forOrg: '0'
  })
  useEffect(() => {
    if (props.data) {
      let newFormData = { ...props.data }
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
        let apiFn = props.data ? apiEditRole : apiAddRole
        let params = { ...formData }
        if (!props.data) {
          delete params.rid
        }
        apiFn(params)
          .then(res => {
            if (props.callback) {
              props.callback()
            }
            props.remove()
          })
          .finally(() => {
            setLoading(false)
          })
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
          onValuesChange={handleFormValueChange}
        >
          <Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: '名称不能为空' }]}>
            <Input placeholder="请输入名称" value={formData.roleName} />
          </Form.Item>
          <Form.Item label="角色类型" name="roleType" rules={[{ required: true, message: '角色类型不能为空' }]}>
            <Select options={roleTypeConst} value={formData.roleType} />
          </Form.Item>
          <Form.Item label="状态" name="states" required>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked checked={formData.states} />
          </Form.Item>
          <Form.Item label="描述信息" name="roleDesc">
            <Input.TextArea placeholder="请输入描述信息" value={formData.roleDesc} showCount maxLength={255} />
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
