import eventBus from '@/event-bus'
import { Dropdown, Tooltip } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'

const OptPopover: FC<any> = props => {
  const handleClick = ({ key }) => {
    props.handleClick(key)
  }

  const items = [
    {
      key: 'closeCurrent',
      label: '关闭当前页'
    },
    {
      key: 'closeOther',
      label: '关闭其他'
    },
    {
      key: 'closeAll',
      label: '关闭所有'
    },
    {
      key: 'refresh',
      label: '刷新'
    }
  ]
  return (
    <Dropdown trigger={props.trigger} menu={{ items, onClick: handleClick }}>
      {props.children}
    </Dropdown>
  )
}

export default OptPopover
