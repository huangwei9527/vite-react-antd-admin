import React, { FC, useEffect, useState } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData, setTableLoading } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, DatePicker, Input, message, Popconfirm, Space, Switch, Tag } from 'antd'
import FilterIterm from '@/components/filter-item'
import WrapperTable from '@/components/WrapperTable'
import FilterRefresh from '@/components/filter-refresh'
import { DeleteOutlined, ManOutlined, PlusOutlined, WomanOutlined } from '@ant-design/icons'
import { apiAccountResetPass, apiAccountUpdateState, apiDeleteAccount } from './api'
import DialogPromiseConfirm from '@/components/dialogs/dialog-promise-confirm'
import DialogEditAccount from './components/dialog-edit-account'
import { DialogBase } from '@/components/dialogs/dialog-info'
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
    DialogEditAccount({
      title: record?.id ? '编辑用户' : '新增用户',
      data: record,
      callback() {
        dispatch(getTableData({}))
        message.success('操作成功！')
      }
    })
  }
  // 删除
  const handleDelete = id => {
    dispatch(setTableLoading(true))
    apiDeleteAccount({ id })
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
    apiAccountUpdateState({ id: item.id, states: newStates })
      .then(() => {
        message.success('操作成功！')
        newRows[index] = { ...newRows[index], states: newStates }
        dispatch(setTableData({ data: newRows }))
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }
  // 重置密码
  const handleResetPass = record => {
    dispatch(setTableLoading(true))
    apiAccountResetPass({ id: record.id })
      .then(() => {
        DialogBase({ title: '系统提示', type: 'info', body: '已重置密码，请让用户重新登录！' })
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }

  const columns: any = [
    { dataIndex: 'loginName', title: '登录名', width: 130 },
    { dataIndex: 'name', title: '姓名', width: 130 },
    {
      dataIndex: 'gender',
      title: '性别',
      width: 100,
      render: (val, record, index) => {
        return (
          <span className={styles.gender}>
            {val === 2 ? '女' : '男'}
            {val === 2 ? <WomanOutlined /> : <ManOutlined />}
          </span>
        )
      }
    },
    { dataIndex: 'age', title: '年龄', width: 100 },
    { dataIndex: 'phone', title: '手机号', width: 160 },
    { dataIndex: 'mail', title: '邮箱', width: 198 },
    {
      dataIndex: 'states',
      title: '状态',
      width: 110,
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
    { dataIndex: 'srouces', title: '来源', width: 100 },
    { dataIndex: 'date', title: '创建时间', width: 140 },
    {
      dataIndex: 'opt',
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (val, record) => {
        return (
          <div>
            <Space>
              <span className="is-link" onClick={() => handleEdit(record)}>
                修改
              </span>
              <span className="is-link" onClick={() => handleResetPass(record)}>
                重置密码
              </span>
              <Popconfirm title="系统提示" description="确认删除该数据?" onConfirm={() => handleDelete(record.id)}>
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
              <FilterIterm label="名字" labelWidth={48}>
                <Input
                  className="filter-iterm-input"
                  allowClear={false}
                  value={filterParams.name}
                  placeholder="请输入名称搜索"
                  onPressEnter={e => {
                    dispatch(getTableData({}))
                  }}
                  onChange={e => {
                    dispatch(setFilterParams({ name: e.target.value }))
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterIterm label="手机号" labelWidth={78}>
                <Input
                  className="filter-iterm-input"
                  allowClear={false}
                  value={filterParams.phone}
                  placeholder="请输入手机号搜索"
                  onPressEnter={e => {
                    dispatch(getTableData({}))
                  }}
                  onChange={e => {
                    dispatch(setFilterParams({ phone: e.target.value }))
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterIterm label="描述信息" labelWidth={78}>
                <Input
                  className="filter-iterm-input"
                  allowClear={false}
                  value={filterParams.email}
                  placeholder="请输入邮箱搜索"
                  onPressEnter={e => {
                    dispatch(getTableData({}))
                  }}
                  onChange={e => {
                    dispatch(setFilterParams({ email: e.target.value }))
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
          rowKey="id"
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
