import React, { FC, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Modal, Button, Form, Input, Space, Radio, message, InputNumber, TreeSelect, Switch, Select } from 'antd'
import ProviderStoreComponent from '@/components/ProviderStoreComponent'
import { organizationTypeConst } from '@/const'
import { apiAddOrganization, apiEditOrganization } from '../api'
import { transOrgTreeToTreeSelectData } from '../helps'

export interface IProps {
  title?: string
  data?: any
  organizationTree?: any
  callback?: () => void
  [key: string]: any
}

const Component: FC<IProps> = props => {
  const [visible] = useState(props.visible)
  const [loading, setLoading] = useState(false)
  const [organizationTree, setOrganizationTree] = useState([])
  const [form] = Form.useForm()
  const [formData, setFormData] = useState({
    pid: props.data.pid || '0',
    pName: props.data.pName || '',
    orgId: '',
    orgName: '',
    orgShort: '',
    ords: 1,
    states: true,
    types: '0'
  })
  useEffect(() => {
    // 初始化树节点
    initOrganizationTree()
    if (props.data?.orgId) {
      let newFormData = { ...props.data }
      form.setFieldsValue({ ...newFormData })
      handleFormValueChange(newFormData)
    } else {
      form.setFieldsValue({ ...formData })
    }
  }, [])

  const initOrganizationTree = () => {
    let treeData = transOrgTreeToTreeSelectData([
      {
        orgName: '根节点',
        orgId: '0',
        children: [...(props.organizationTree || [])]
      }
    ])
    setOrganizationTree(treeData)
  }

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
        let apiFn = props.data?.orgId ? apiEditOrganization : apiAddOrganization
        let params = { ...formData }
        if (!props.data?.orgId) {
          delete params.orgId
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
          <Form.Item label="上级组织机构" name="pid" required>
            <TreeSelect
              value={formData.pid}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={organizationTree}
              placeholder="根节点"
              treeDefaultExpandedKeys={['0']}
            />
          </Form.Item>
          <Form.Item label="名称" name="orgName" rules={[{ required: true, message: '名称不能为空' }]}>
            <Input placeholder="请输入名称" value={formData.orgName} />
          </Form.Item>
          <Form.Item label="简称" name="orgShort" rules={[{ required: true, message: '简称不能为空' }]}>
            <Input placeholder="请输入简称" value={formData.orgShort} />
          </Form.Item>
          <Form.Item label="类型" name="types">
            <Select options={organizationTypeConst} value={formData.types} />
          </Form.Item>
          <Form.Item label="状态" name="states" required>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked checked={formData.states} />
          </Form.Item>
          <Form.Item label="排序" name="ords" required>
            <InputNumber changeOnWheel={true} controls={true} value={formData.ords} min={0} />
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
      width: options.width || 540,
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
