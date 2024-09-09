import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import SettingDialog from '../setting-dialog'

const Component = props => {
  const handleClick = () => {
    SettingDialog({})
  }
  return (
    <div className={styles.wrapper} onClick={handleClick}>
      <i className="iconfont icon-shezhi" title="应用设置"></i>
    </div>
  )
}

export default React.memo(Component)
