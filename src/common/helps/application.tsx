/**
 * 系统公共function
 */
import React from 'react'
import { createRoot } from 'react-dom/client'
import store from '@/store'
import DialogInfo, { DialogBase } from '@/components/dialogs/dialog-info'
import { Spin } from 'antd'

/**
 * 没有权限提示
 */
export function noPermissionNotice() {
  DialogBase({
    type: 'warning',
    title: '系统提示',
    body: '您没有该功能的使用权限，请联系系统管理员为您授权！',
    okText: '我知道了',
    onOk: next => {
      next(true)
    }
  })
}
/**
 * 只读系统弹窗提示
 */
export function isReadSiteNotice() {
  DialogBase({
    type: 'warning',
    title: '系统提示',
    body: '本系统为查询系统，请勿进行更新操作！',
    okText: '我知道了',
    onOk: next => {
      next(true)
    }
  })
}
/**
 * 跳转到登陆页面
 */
export function redirectLogout() {
  window.location.href = '/kuaiji/logout'
}

/**
 * 登录超时提示
 */
let hasShowLogoutTips = false
export function noticeLogout() {
  if (hasShowLogoutTips) {
    return
  }
  DialogBase({
    type: 'warning',
    title: '登录提示',
    body: '您已登录超时，请重新登录！',
    okText: '我知道了',
    onOk: next => {
      hasShowLogoutTips = true
      redirectLogout()
      next(true)
    }
  })
}

/**
 * 全局loading提示
 */
let globalLoadingInst = null
export function showGlobalLoading(text = '') {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  const Component = () => {
    return (
      <div className="global-loading-wrapper">
        <Spin spinning={true}>{text || '加载中...'}</Spin>
      </div>
    )
  }
  globalLoadingInst = () => {
    document.body.removeChild(div)
  }
  root.render(React.createElement(Component, {}))
}
export function closeGlobalLoading() {
  if (globalLoadingInst) {
    globalLoadingInst()
    globalLoadingInst = null
  }
}

/**
 * 权限判断方法
 * @param code 权限码 支持数组
 * @param showNoPermissionTips 是否显示无权限提示
 * @returns {boolean}
 */
export function verifyPermission(code, showNoPermissionTips = false) {
  const { systemInitData, permissions } = store.getState().app
  const isAdmin = systemInitData.isAdmin
  const isReadSite = systemInitData.isReadSite
  const permissionsList: any = permissions
  const verifyFn = (c: any) => {
    if (!c) {
      return true
    }
    if (isAdmin && !isReadSite) {
      return true
    }
    if (!Array.isArray(c)) {
      return !c || permissionsList.includes(Number(c) || 0)
    }
    if (c.length === 1) {
      return !c[0] || permissionsList.includes(Number(c[0]))
    }
    // 只要有一个匹配则认为有权限
    for (let i = 0, len = c.length; i < len; i++) {
      if (permissionsList.includes(Number(c[i]))) {
        return true
      }
    }
    return false
  }
  const hasAuth = verifyFn(code)
  if (hasAuth || !showNoPermissionTips) {
    return hasAuth
  }
  showNoPermissionDialog()
  return hasAuth
}

export const hasAuth = verifyPermission // 换个简单的name

export function showNoPermissionDialog() {
  const { systemInitData } = store.getState().app
  const isReadSite = systemInitData.isReadSite
  // 显示提示
  if (isReadSite) {
    isReadSiteNotice()
  } else {
    noPermissionNotice()
  }
}
