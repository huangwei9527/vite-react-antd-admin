import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import { useAppSelector } from '@/store/redux-hooks'
import classNames from 'classnames'
import UserHeader from './user-header'

const Layout: FC = () => {
  const { hideHeader } = useAppSelector(store => store.app)

  return (
    <div className={classNames(styles.wrapper, { [styles.hideHeader]: hideHeader })} onClick={e => e.stopPropagation()}>
      <div className={styles.content}>
        <span className={styles.title}>xxxx系统</span>
      </div>
      <div className={styles.contentRight}>
        <UserHeader />
      </div>
    </div>
  )
}

export default Layout
