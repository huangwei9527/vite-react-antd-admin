import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { updateLocalstorageCache } from '@/store/modules/localCacheSlice'
import classNames from 'classnames'

interface Props {}

const Component: FC<Props> = props => {
  const dispatch = useAppDispatch()
  const { sidebarCollapsed } = useAppSelector(s => s.localCache)
  const toggle = e => {
    dispatch(updateLocalstorageCache({ sidebarCollapsed: !sidebarCollapsed }))
  }
  return (
    <div
      className={classNames(styles.wrapper, { [styles.isR]: sidebarCollapsed })}
      onClick={toggle}
      title={sidebarCollapsed ? '展开导航' : '收起导航'}
    >
      <i className="inline-block shouqi-zhankai iconfont icon-xiangzuo1"></i>
    </div>
  )
}

export default React.memo(Component)
