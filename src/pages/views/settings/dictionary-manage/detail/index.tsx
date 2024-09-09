import React, { FC, useEffect, useState } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setFilterParams, setTableData, setTableLoading } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, DatePicker, Dropdown, Input, message, Popconfirm, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import FilterIterm from '@/components/filter-item'
import WrapperTable from '@/components/WrapperTable'
import FilterRefresh from '@/components/filter-refresh'
import { FilterItemSelect } from '@/components/filter-item-components'
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
import { apiDeleteDictionary } from './api'
import DialogPromiseConfirm from '@/components/dialogs/dialog-promise-confirm'
import { addTabPage, getRouteSearchQuery } from '@/common/helps/tabRoute'
import DialogEditDictionary from './components/dialog-edit-dictionary'
import { dictionaryStateConst } from '@/const'
import { tableExpandIcon } from '@/utils/antdHelps'
const Component: FC = () => {
  const dispatch = useAppDispatch()
  const tabRouteQuery = getRouteSearchQuery()
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
  const handleEdit = (record = null, isAddChildren = false) => {
    DialogEditDictionary({
      title: '编辑字典',
      data: {
        ...record,
        parentId: tabRouteQuery.id,
        parentName: tabRouteQuery.dictName
      },
      callback() {
        dispatch(getTableData({}))
        message.success('操作成功！')
      }
    })
  }
  // 新增
  const handleAdd = (record: any = {}) => {
    DialogEditDictionary({
      title: record?.id ? '新增字典项子项' : '新增字典项',
      data: {
        parentId: record?.id || tabRouteQuery.id,
        parentName: record?.name || tabRouteQuery.dictName
      },
      callback() {
        dispatch(getTableData({}))
        message.success('操作成功！')
      }
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
    { dataIndex: 'name', title: '字典项名称' },
    { dataIndex: 'code', title: '字典项键值' },
    { dataIndex: 'index', title: '排序', width: 80 },
    {
      dataIndex: 'state',
      title: '状态',
      width: 110,
      render: (val, record) => {
        return val === 1 ? <Tag color="success">正常</Tag> : <Tag color="error">停用</Tag>
      }
    },
    { dataIndex: 'remark', title: '备注', width: 140 },
    { dataIndex: 'creater', title: '创建人', width: 120 },
    { dataIndex: 'date', title: '创建时间', width: 130 },
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
              <span className="is-link" onClick={() => handleAdd(record)}>
                新增
              </span>
              <Popconfirm title="系统提示" description="确认删除该数据?" onConfirm={() => handleDelete([record.id])}>
                <span className="is-link error">删除</span>
              </Popconfirm>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      icon: <VerticalAlignTopOutlined />,
                      label: '置顶'
                    },
                    {
                      key: '2',
                      icon: <ArrowUpOutlined />,
                      label: '上移'
                    },
                    {
                      key: '3',
                      icon: <ArrowDownOutlined />,
                      label: '下移'
                    }
                  ]
                }}
              >
                <i className="iconfont icon-gengduo is-link top2" title="更多"></i>
              </Dropdown>
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
              <FilterRefresh onClick={() => dispatch(getTableData({}))} />
            </div>
          </div>
          <div className={classnames('app-page1-filter-container-btns', styles.btns)}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
                新增
              </Button>
              <Button icon={<DeleteOutlined />} onClick={handleDeleteMult}>
                删除
              </Button>
            </Space>
          </div>
        </div>
      </div>
      <div className={styles.tableTitle}>
        字典: {tabRouteQuery.dictName} <span className="gray">({tabRouteQuery.dictCode})</span>
      </div>
      <div className="app-page1-table">
        <WrapperTable
          rowKey="id"
          loading={tableParams.loading}
          dataSource={tableParams.data}
          columns={columns}
          rowSelection={rowSelection}
          showCount={true}
          totalCount={tableParams.total}
          expandIcon={tableExpandIcon}
        />
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
