import React, { FC, useEffect, useState } from 'react'
import { withPageSlice } from '@/store/withPageSlice'
import dymaticSlice, { getTableData, setExpandAll, setFilterParams, setTableData, setTableLoading } from './store'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import * as pageConst from './const'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button, DatePicker, Dropdown, message, Popconfirm, Space, Switch } from 'antd'
import WrapperTable from '@/components/WrapperTable'
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
import FilterItemSearch from '@/components/filter-item-search'
import { FilterItemCheckbox } from '@/components/filter-item-components'
import FilterRefresh from '@/components/filter-refresh'
import { tableExpandIcon } from '@/utils/antdHelps'
import DialogEditOrganization from './components/dialog-edit-organization'
import { apiDeleteOrganization, apiOrganizationUpAndDown, apiOrganizationUpdateState } from './api'
import { transformDictListToMap, treeToArray } from '@/utils/util'
import { organizationTypeConst } from '@/const'
// 组织类型
const organizationTypeConstMap = transformDictListToMap(organizationTypeConst)

const Component: FC = () => {
  const dispatch = useAppDispatch()
  const { filterParams, tableParams, expandAll } = useAppSelector(state => state[pageConst.PAGE_NAME])
  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  useEffect(() => {
    dispatch(getTableData())
  }, [])

  // 切换展开全部
  const handleToggleExpandAll = val => {
    if (!val) {
      setExpandedRowKeys([])
      return
    }
    // 获取所有的pid
    let treeArray = treeToArray(tableParams.data)
    let pIds = treeArray.filter(v => !v.leaf).map(v => v.orgId)
    setExpandedRowKeys([...pIds])
  }
  // 编辑
  const handleEdit = (record = null) => {
    DialogEditOrganization({
      title: '编辑组织机构',
      data: {
        ...record
      },
      organizationTree: tableParams.data,
      callback() {
        dispatch(getTableData({}))
        message.success('操作成功！')
      }
    })
  }
  // 新增
  const handleAdd = (record: any = {}) => {
    DialogEditOrganization({
      title: '新增字组织机构',
      data: {
        pid: record?.orgId || '',
        pName: record?.orgName || ''
      },
      organizationTree: tableParams.data,
      callback() {
        dispatch(getTableData({}))
        message.success('操作成功！')
      }
    })
  }
  // 删除
  const handleDelete = id => {
    dispatch(setTableLoading(true))
    apiDeleteOrganization({ id })
      .then(() => {
        dispatch(getTableData({}))
        message.success('删除成功！')
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }

  // 启用禁用
  const handleToggleState = (item, index) => {
    const newRows = [...tableParams.data]
    let newStates = !newRows[index].states
    dispatch(setTableLoading(true))
    apiOrganizationUpdateState({ orgId: item.orgId, states: newStates })
      .then(() => {
        message.success('操作成功！')
        newRows[index] = { ...newRows[index], states: newStates }
        dispatch(setTableData({ data: newRows }))
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }
  // 上移下移
  const handleUpAndDown = (id, type) => {
    dispatch(setTableLoading(true))
    apiOrganizationUpAndDown({ oid: id, op: type })
      .then(() => {
        dispatch(getTableData({}))
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }
  // 更多按钮点击
  const handleMoreOptClick = (record, key) => {
    if (key === 'up' || key === 'down') {
      handleUpAndDown(record.orgId, key)
    }
  }

  // 表格展开收起
  const onExpand = keys => {
    setExpandedRowKeys(keys)
  }

  const columns: any = [
    { dataIndex: 'orgName', title: '组织名称' },
    {
      dataIndex: 'types',
      title: '分类',
      width: 140,
      render: (val, record) => {
        return organizationTypeConstMap[val] || ''
      }
    },
    {
      dataIndex: 'states',
      title: '状态',
      width: 110,
      align: 'center',
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
    { dataIndex: 'value1', title: '角色', width: 150 },
    { dataIndex: 'number', title: '人员', width: 100 },
    { dataIndex: 'ords', title: '排序', width: 100 },
    {
      dataIndex: 'opt',
      title: '操作',
      align: 'right',
      width: 170,
      render: (val, record) => {
        return (
          <Space align="end">
            <span className="is-link" onClick={() => handleEdit(record)}>
              编辑
            </span>
            <span className="is-link" onClick={() => handleAdd(record)}>
              新增
            </span>
            <Popconfirm title="系统提示" description="确认删除该数据?" onConfirm={() => handleDelete(record.orgId)}>
              <span className="is-link error">删除</span>
            </Popconfirm>
            <Dropdown
              menu={{
                onClick: e => handleMoreOptClick(record, e.key),
                items: [
                  {
                    key: 'up',
                    icon: <ArrowUpOutlined />,
                    label: '上移'
                  },
                  {
                    key: 'down',
                    icon: <ArrowDownOutlined />,
                    label: '下移'
                  }
                ]
              }}
            >
              <i className="iconfont icon-gengduo is-link top3" title="更多"></i>
            </Dropdown>
          </Space>
        )
      }
    }
  ]
  return (
    <div className={classnames('app-page1', styles.wrapper)}>
      <div className="app-page1-filter">
        <div className={classnames('app-page1-filter-container', styles.filter)}>
          <div className="page1-filter-container">
            <div className="inline-block marginR12">
              <FilterItemSearch
                label="关键字"
                labelWidth={58}
                placeholder="请输入关键字搜索"
                value={filterParams.keywords}
                onSearch={() => dispatch(getTableData())}
                onChange={str => dispatch(setFilterParams({ keywords: str }))}
              />
            </div>
            <div className="inline-block marginR12">
              <FilterItemCheckbox
                checked={expandAll}
                label="展开所有级次"
                onChange={val => {
                  dispatch(setExpandAll(val))
                  handleToggleExpandAll(val)
                }}
              />
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
            </Space>
          </div>
        </div>
      </div>
      <div className="app-page1-table">
        <WrapperTable
          key="orgId"
          loading={tableParams.loading}
          dataSource={tableParams.data}
          columns={columns}
          expandable={{ indentSize: 28, expandedRowKeys, onExpand }}
          expandIcon={tableExpandIcon}
        />
      </div>
    </div>
  )
}

export default withPageSlice(Component, dymaticSlice)
