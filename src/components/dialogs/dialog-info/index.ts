import ProviderStoreComponent from '@/components/ProviderStoreComponent'
/**
 * Modal.confirm 具有confirm弹窗，but...
 * onOk 执行，会直接关掉弹窗，如果有异步请求，无法处理。
 * 在 antDesign 的 Modal 组件基础上重写一个符合业务的基础版本弹窗。
 *
 * v0.0.1 在原有的基础上增加功能：
 *      1： 支持异步关闭窗口
 *      2： 支持设置 top 值
 *      3： 支持高度自适应
 *
 * 不支持：body 传带有状态的组件不能在外面获取到
 * 仅支持信息类的弹窗
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import Index, { IProps } from './dialog'

function fn(options: IProps) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  root.render(
    React.createElement(ProviderStoreComponent(Index), {
      width: 420,
      title: '操作确认',
      okText: '确定',
      cancelText: '取消',
      ...options,
      visible: true,
      remove: () => {
        if (options.next) {
          options.next()
        }
        if (options.close) {
          options.close()
        }
        root.unmount()
        document.body.removeChild(div)
      }
    })
  )
}
export default fn
export const DialogBase = fn
