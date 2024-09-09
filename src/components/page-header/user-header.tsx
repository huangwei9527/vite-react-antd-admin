import React, { useState } from 'react'
import styles from './index.module.less'
import { Avatar, MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import { useAppSelector } from '@/store/redux-hooks'
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { addTabPage } from '@/common/helps/tabRoute'
import defaultUserImg from '@/assets/images/default-header.jpg'

export default function Layout(props) {
  const navigate = useNavigate()
  const { systemInitData } = useAppSelector(store => store.app)
  const handleClick = ({ key }) => {
    if (key === 'logout') {
      logout()
    }
    if (key === 'userInfo') {
      navToUserInfo()
    }
  }
  const logout = () => {
    navigate('/login')
  }
  const navToUserInfo = () => {
    addTabPage({
      id: '/user-info',
      title: '个人信息',
      path: '/user-info'
    })
  }
  const items = [
    {
      key: 'userInfo',
      label: '个人信息',
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />
    }
  ]
  return (
    <Dropdown menu={{ items, onClick: handleClick }}>
      <a onClick={e => e.preventDefault()}>
        <Space size={4}>
          <Avatar src={systemInitData.avatar || defaultUserImg} size="small" style={{ backgroundColor: '#f56a00' }} />
          <span>huangwei</span>
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  )
}
