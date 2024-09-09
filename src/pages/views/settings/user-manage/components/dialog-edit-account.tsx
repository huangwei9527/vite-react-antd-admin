import React, { FC, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Modal, Button, Checkbox, Form, Input, Space, Radio, message, Select, Switch, InputNumber } from 'antd'
import ProviderStoreComponent from '@/components/ProviderStoreComponent'
import { apiAccountcheck, apiAddAccount, apiEditAccount } from '../api'

export interface IProps {
  title?: string
  data?: any
  callback?: () => void
  [key: string]: any
}

const Component: FC<IProps> = props => {
  const [visible] = useState(props.visible)
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form] = Form.useForm()
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    mail: '',
    loginName: '',
    userPwd: '',
    age: '18',
    states: true,
    gender: 1
  })
  useEffect(() => {
    if (props.data) {
      let newFormData = { ...props.data }
      form.setFieldsValue({ ...newFormData })
      handleFormValueChange(newFormData)
    } else {
      form.setFieldsValue({ ...formData })
    }
    setIsEdit(!!props.data)
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
        let apiFn = props.data ? apiEditAccount : apiAddAccount
        let params = { ...formData }
        if (!isEdit) {
          delete params.id
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
          clearOnDestroy={true}
          labelCol={{ span: 4 }}
          initialValues={{ remember: true }}
          onValuesChange={handleFormValueChange}
        >
          <Form.Item
            label="登录名"
            name="loginName"
            validateDebounce={1000}
            rules={[
              { required: true, message: '登录名不能为空' },
              {
                validator(_, value) {
                  return new Promise((resolve, reject) => {
                    if (isEdit && value === props.data.loginName) {
                      // 编辑时不校验自身
                      return resolve(true)
                    }
                    apiAccountcheck({ type: 3, search: value })
                      .then(res => {
                        if (res.data) {
                          reject(new Error('登录名已存在!'))
                        } else {
                          return resolve(true)
                        }
                      })
                      .catch(() => {
                        reject(new Error('登录名已存在!'))
                      })
                  })
                }
              }
            ]}
          >
            <Input disabled={isEdit} placeholder="请输入登录名" value={formData.loginName} />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '名称不能为空' }]}>
            <Input placeholder="请输入名称" value={formData.name} />
          </Form.Item>
          {!isEdit && (
            <Form.Item label="密码" name="userPwd" rules={[{ required: true, message: '密码不能为空' }]}>
              <Input.Password placeholder="请输入密码" value={formData.name} />
            </Form.Item>
          )}
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '手机号不能为空' },
              {
                validator(_, value) {
                  return new Promise((resolve, reject) => {
                    if (isEdit && value === props.data.phone) {
                      // 编辑时不校验自身
                      return resolve(true)
                    }
                    apiAccountcheck({ type: 1, search: value })
                      .then(res => {
                        if (res.data) {
                          reject(new Error('手机号已存在!'))
                        } else {
                          return resolve(true)
                        }
                      })
                      .catch(() => {
                        reject(new Error('手机号已存在!'))
                      })
                  })
                }
              }
            ]}
          >
            <Input placeholder="请输入手机号" value={formData.phone} />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="mail"
            rules={[
              { required: true, message: '邮箱不能为空' },
              {
                type: 'email',
                message: '请输入正确邮箱地址'
              },
              {
                validator(_, value) {
                  return new Promise((resolve, reject) => {
                    if (isEdit && value === props.data.mail) {
                      // 编辑时不校验自身
                      return resolve(true)
                    }
                    apiAccountcheck({ type: 2, search: value })
                      .then(res => {
                        if (res.data) {
                          reject(new Error('邮箱已存在!'))
                        } else {
                          return resolve(true)
                        }
                      })
                      .catch(() => {
                        reject(new Error('邮箱已存在!'))
                      })
                  })
                }
              }
            ]}
          >
            <Input placeholder="请输入邮箱" value={formData.mail} />
          </Form.Item>
          <Form.Item label="性别" name="gender" rules={[{ required: true, message: '性别不能为空' }]}>
            <Radio.Group value={formData.gender}>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="年龄" name="age" rules={[{ required: true, message: '年龄不能为空' }]}>
            <InputNumber changeOnWheel={true} controls={true} value={formData.age} />
          </Form.Item>
          <Form.Item label="状态" name="states" required>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked checked={formData.states} />
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
