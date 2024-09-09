import React, { FC } from 'react'
import { verifyPermission, showNoPermissionDialog } from '@/config/permission-config'
import styles from './index.module.less'
import { cloneElement } from '@/utils/reactNode'
import classnames from 'classnames'
const noPermissionImg = require('@/assets/images/no_permission.png')
type IProps = {
  /** 权限标识 */
  authCode: string | string[] | number | number[]
  noAuthHide?: boolean // 没权限时隐藏元素 、、 默认不隐藏
  showNoAuthPanel?: boolean // 没权限时显示无权限提示样式
  [key: string]: any
}
const AuthWrapper: FC<IProps> = props => {
  // 计算是否有权限
  const hasAuth = verifyPermission(props.authCode)
  // 显隐控制
  return (
    <>
      {hasAuth && props.children}
      {!hasAuth &&
        !props.showNoAuthPanel &&
        !props.noAuthHide &&
        cloneElement(props.children, { onClick: showNoPermissionDialog })}
      {!hasAuth && props.showNoAuthPanel && (
        <div className={classnames('auth-no-permission-panel', styles.noPermission)}>
          <div>
            <img src={noPermissionImg} alt="暂无权限" />
            <p>您暂无权限查看此内容</p>
          </div>
        </div>
      )}
    </>
  )
}

export default AuthWrapper
