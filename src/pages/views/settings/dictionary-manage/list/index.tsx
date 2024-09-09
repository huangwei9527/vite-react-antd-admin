import React, { FC, useEffect, useState } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData, setTableLoading } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, DatePicker, Input, message, Popconfirm, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import FilterIterm from '@/components/filter-item'
import WrapperTable from '@/components/WrapperTable'
import FilterRefresh from '@/components/filter-refresh'
import { FilterItemSelect } from '@/components/filter-item-components'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { apiDeleteDictionary } from './api'
import DialogPromiseConfirm from '@/components/dialogs/dialog-promise-confirm'
import { addTabPage } from '@/common/helps/tabRoute'
import DialogEditDictionary from './components/dialog-edit-dictionary'
import { dictionaryStateConst } from '@/const'
const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { systemInitData } = useAppSelector(state => state.app)
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
    DialogEditDictionary({
      title: record?.id ? '编辑字典' : '新增字典',
      data: record,
      callback() {
        dispatch(getTableData({}))
        message.success('操作成功！')
      }
    })
  }
  // 跳转到字典项
  const handleNavToDictDetail = record => {
    addTabPage({
      id: 'setting/dictionary/detail',
      title: '字典项',
      path: `/setting/dictionary/detail?id=${record.id}&dictName=${record.name}&dictCode=${record.code}`
    })
  }
  // 删除
  const handleDelete = ids => {
    dispatch(setTableLoading(true))
    apiDeleteDictionary({ ids })
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

  const columns: any = [
    { dataIndex: 'name', title: '字典名称' },
    { dataIndex: 'code', title: '字典编码' },
    {
      dataIndex: 'state',
      title: '状态',
      width: 110,
      render: (val, record) => {
        return val === 1 ? <Tag color="success">正常</Tag> : <Tag color="error">停用</Tag>
      }
    },
    { dataIndex: 'remark', title: '备注' },
    { dataIndex: 'creater', title: '创建人', width: 120 },
    { dataIndex: 'date', title: '创建时间', width: 130 },
    { dataIndex: 'date', title: '更新时间', width: 130 },
    {
      dataIndex: 'opt',
      title: '操作',
      width: 160,
      render: (val, record) => {
        return (
          <div>
            <Space>
              <span className="is-link" onClick={() => handleNavToDictDetail(record)}>
                字典项
              </span>
              <span className="is-link" onClick={() => handleEdit(record)}>
                修改
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
              <FilterIterm label="关键字" labelWidth={58}>
                <Input
                  className="filter-iterm-input"
                  allowClear={false}
                  value={filterParams.keywords}
                  placeholder="请输入关键字搜索"
                  onPressEnter={e => {
                    dispatch(getTableData({}))
                  }}
                  onChange={e => {
                    dispatch(setFilterParams({ keywords: e.target.value }))
                  }}
                />
              </FilterIterm>
            </div>
            <div className="inline-block marginR12">
              <FilterItemSelect
                label="状态"
                value={filterParams.state}
                labelWidth={58}
                valueWidth={80}
                onChange={val => dispatch(getTableData({ state: val }))}
                options={[{ label: '全部', value: '' }, ...dictionaryStateConst]}
              />
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