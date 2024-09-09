import React, { FC, useEffect, useState } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData, setTableLoading } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, DatePicker, Input, message, Popconfirm, Space, Switch, Tag } from 'antd'
import dayjs from 'dayjs'
import FilterIterm from '@/components/filter-item'
import WrapperTable from '@/components/WrapperTable'
import FilterRefresh from '@/components/filter-refresh'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { apiDeleteRole, apiRoleUpdateState } from './api'
import DialogPromiseConfirm from '@/components/dialogs/dialog-promise-confirm'
import DialogEditRole from './components/dialog-edit-role'
const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { filterParams, tableParams } = useAppSelector(state => state[pageConst.PAGE_NAME])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  useEffect(() => {
    dispatch(getTableData())
  }, [])

  // 表格翻页
  const handlePageChange = (page: number, pageSize: number) => {
    dispatch(getTableData({ page, pageSize }))
  }
  // 表格选择操作
  const handleTableSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  // 编辑
  const handleEdit = (record = null) => {
    DialogEditRole({
      title: record?.id ? '编辑角色' : '新增角色',
      data: record,
      callback() {
        dispatch(getTableData({}))
        message.success('操作成功！')
      }
    })
  }
  // 删除
  const handleDelete = ids => {
    dispatch(setTableLoading(true))
    apiDeleteRole({ ids })
      .then(() => {
        dispatch(getTableData({}))
        message.success('删除成功！')
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }
  // 批量删除
  const handleDeleteMult = async () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要删除的数据项')
      return
    }
    let askRes = await DialogPromiseConfirm({ body: '确认删除选中数据?', type: 'warning' })
    if (askRes) {
      handleDelete(selectedRowKeys)
    }
  }

  // 启用禁用
  const handleToggleState = (item, index) => {
    const newRows = [...tableParams.data]
    let newStates = !newRows[index].states
    dispatch(setTableLoading(true))
    apiRoleUpdateState({ orgId: item.orgId, states: newStates })
      .then(() => {
        message.success('操作成功！')
        newRows[index] = { ...newRows[index], states: newStates }
        dispatch(setTableData({ data: newRows }))
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }

  const columns: any = [
    { dataIndex: 'roleName', title: '角色名称' },
    { dataIndex: 'tpyeDesc', title: '类型' },
    { dataIndex: 'forOrg', title: '所属组织' },
    {
      dataIndex: 'states',
      title: '状态',
      render: (val, record, index) => {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={val}
            onChange={e => handleToggleState(record, index)}
          />
        )
      }
    },
    { dataIndex: 'date', title: '创建时间' },
    { dataIndex: 'roleDesc', title: '角色描述' },
    {
      dataIndex: 'opt',
      title: '操作',
      width: 170,
      render: (val, record) => {
        return (
          <div>
            <Space>
              <span className="is-link" onClick={() => handleEdit(record)}>
                修改
              </span>
              <span className="is-link" onClick={() => handleEdit(record)}>
                分配权限
              </span>
              <Popconfirm title="系统提示" description="确认删除该数据?" onConfirm={() => handleDelete([record.id])}>
                <span className="is-link error">删除</span>
              </Popconfirm>
            </Space>
          </div>
        )
      }
    }
  ]
  const rowSelection = {
    selectedRowKeys,
    onChange: handleTableSelectChange
  }
  return (
    <div className={classnames('app-page1', styles.wrapper)}>
      <div className="app-page1-filter">
        <div className={classnames('app-page1-filter-container', styles.filter)}>
          <div className="page1-filter-container">
            <div className="inline-block marginR12">
              <FilterIterm label="名称" labelWidth={48}>
                <Input
                  className="filter-iterm-input"
                  allowClear={false}
                  value={filterParams.role_name}
                  placeholder="请输入名称搜索"
                  onPressEnter={e => {
                    dispatch(getTableData({}))
                  }}
                  onChange={e => {
                    dispatch(setFilterParams({ role_name: e.target.value }))
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterIterm label="描述信息" labelWidth={78}>
                <Input
                  className="filter-iterm-input"
                  allowClear={false}
                  value={filterParams.role_desc}
                  placeholder="请输入关键字搜索"
                  onPressEnter={e => {
                    dispatch(getTableData({}))
                  }}
                  onChange={e => {
                    dispatch(setFilterParams({ role_desc: e.target.value }))
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterRefresh onClick={() => dispatch(getTableData({}))} />
            </div>
          </div>
          <div className={classnames('app-page1-filter-container-btns', styles.btns)}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEdit()}>
                新增
              </Button>
              <Button icon={<DeleteOutlined />} onClick={handleDeleteMult}>
                删除
              </Button>
            </Space>
          </div>
        </div>
      </div>
      <div className="app-page1-table">
        <WrapperTable
          rowKey="rid"
          loading={tableParams.loading}
          dataSource={tableParams.data}
          columns={columns}
          onPageChange={handlePageChange}
          pageTotal={tableParams.total}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
