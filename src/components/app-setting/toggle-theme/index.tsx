import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { updateLocalstorageCache } from '@/store/modules/localCacheSlice'

interface Props {}

const Component: FC<Props> = props => {
  const dispatch = useAppDispatch()
  const { sidebarTheme } = useAppSelector(s => s.localCache)
  const toggleThemeMode = e => {
    let newThemeMode = sidebarTheme === 'light' ? 'dark' : 'light'
    dispatch(updateLocalstorageCache({ sidebarTheme: newThemeMode }))
  }
  return (
    <div className={styles.wrapper} onClick={toggleThemeMode}>
      {sidebarTheme === 'dark' ? (
        <i className="iconfont icon-moonyueliang" title="暗黑模式"></i>
      ) : (
        <i className="iconfont icon-taiyang" title="明亮模式"></i>
      )}
    </div>
  )
}

export default React.memo(Component)
