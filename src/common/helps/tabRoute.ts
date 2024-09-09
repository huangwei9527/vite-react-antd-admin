/**
 * tab页签相关方法
 */
import store from '@/store'
import { ITabItem, defaultHomeTab, setActiveTab, setTabs, setReloadPath } from '@/store/modules/tabSlice'
import * as config from '@/config'
import { isAsyncFunction, urlParse, getModalContainer } from '@/utils/util'

export function addTabPage(tabItem: ITabItem) {
  const { tabList } = store.getState().tab
  const tabConfig = { ...tabItem, timer: new Date().getTime(), params: tabItem.params || {} }
  if (tabConfig.isIframe) {
    tabConfig.path = '/iframe?url=' + encodeURIComponent(tabConfig.path)
  }
  // 添加tabRouterName
  if (!tabConfig.path.includes('tabRouterName=')) {
    tabConfig.path += (tabConfig.path.includes('?') ? '&' : '?') + 'tabRouterName=' + tabConfig.title || ''
  }
  // 设置当前active tab
  store.dispatch(setActiveTab(tabConfig.path))
  const tabIndex = tabList.findIndex(v => {
    return v.path === tabConfig.path || (tabConfig.id && tabConfig.id === v.id)
  })
  // 路由跳转
  window.location.hash = tabConfig.path
  // 判断是否存在
  if (tabIndex > -1) {
    // 已存在的路由需通过redirect跳转，避免路由参数发生变化页面不刷新
    store.dispatch(
      setTabs(
        tabList.map((v, index) => {
          return index === tabIndex ? { ...tabConfig } : v
        })
      )
    )
    if (!tabItem.notRefresh) {
      refreshTab(tabConfig.path)
    }
  } else {
    // 更新添加tab
    store.dispatch(setTabs([...tabList, tabConfig]))
  }
}

const removeTabModal = () => {
  const parentElement = getModalContainer()
  if (parentElement === undefined) return
  const elementsToRemove = parentElement.querySelectorAll('.modal-inside-owner-page-style')
  elementsToRemove?.forEach?.(element => {
    // 这里之所以是设置 display 是因为有些业务弹窗是通过组件的形式引入，不是动态创建的
    // 有个弊端是通过js创建又正在显示，这时候点击刷新，弹窗的 dom 不会消失
    element.style.display = 'none'
  })
}

/**
 * 刷新当前tab页签
 * @param path 刷新path 默认刷新当前路由
 */
export function refreshTab(path?: string) {
  removeTabModal()
  const { activeTab } = store.getState().tab
  store.dispatch(setReloadPath(path || activeTab))
  setTimeout(() => {
    store.dispatch(setReloadPath(''))
  }, 150)
}
export function refreshTabById(id?: string) {
  if (!id) {
    refreshTab()
  }
  const { tabList } = store.getState().tab
  const refreshIndex = tabList.findIndex(v => v.id === id)
  if (refreshIndex < 0) {
    refreshTab()
  } else {
    refreshTab(tabList[refreshIndex].path)
  }
}

/**
 * 删除tab
 * @param path
 */
export async function removeTab(path?: string) {
  const { activeTab, tabList } = store.getState().tab
  if (!path || tabList.length === 1) return
  const removeIndex = tabList.findIndex(v => v.path === path)
  if (removeIndex < 0) return
  // 删除页签
  const doRemoveFn = () => {
    store.dispatch(setTabs(tabList.filter(v => v.path !== path)))
    if (activeTab === path) {
      backPreViousTab()
    }
  }
  // 如果有beforClose先执行拦截函数
  if (!(tabList?.[removeIndex]?.beforClose && typeof tabList?.[removeIndex]?.beforClose === 'function')) {
    doRemoveFn()
    return
  }
  let allowClose = await tabList?.[removeIndex]?.beforClose()
  if (allowClose) {
    doRemoveFn()
  }
}
/**
 * 删除当前页签
 */
export function removeCurrentTab() {
  const { activeTab } = store.getState().tab
  removeTab(activeTab)
}

/**
 * 返回上一步
 */
export function backPreViousTab() {
  const { tabList } = store.getState().tab
  // 只剩下首页
  if (tabList.length === 1) {
    window.location.hash = defaultHomeTab.path
    store.dispatch(setActiveTab(defaultHomeTab.path))
    return
  }
  let lastVisitTab: ITabItem = tabList[0]
  tabList.forEach(item => {
    if ((lastVisitTab.timer || 0) <= (item.timer || 0)) {
      lastVisitTab = item
    }
  })
  window.location.hash = lastVisitTab.path

  store.dispatch(setActiveTab(lastVisitTab.path))
}

/**
 * 删除所有页签
 */
export function removeAllTab() {
  updateActiveTab(defaultHomeTab.path)
  store.dispatch(setTabs([defaultHomeTab]))
}

/**
 *  删除其他所有标签
 * @param
 */
export function removeOthersTab(path) {
  const { tabList } = store.getState().tab
  const curTab = tabList.find(v => path === v.path)
  updateActiveTab(curTab.path)
  store.dispatch(setTabs(curTab.title === defaultHomeTab.title ? [curTab] : [defaultHomeTab, curTab]))
}

/**
 * 设置当前选中页签切换页签
 */
export function updateActiveTab(path) {
  window.location.hash = path
  store.dispatch(setActiveTab(path))
}
/**
 * @returns 获取当前选中Tab数据
 */
export function getCurrentActiveTab() {
  const { tabList, activeTab } = store.getState().tab
  return tabList.find(v => activeTab === v.path)
}

/**
 * 通过访问路径添加页签
 * @param fullpath
 */
export function checkAndAddTabRoute(fullPath) {
  const { tabList } = store.getState().tab
  // 从fullPath解析当前tabRouteConfig
  let urlP: any = urlParse(fullPath)
  // 如果没有tabRouterName则不添加任何tab页签
  if (!urlP.tabRouterName) {
    store.dispatch(setActiveTab('/home'))
    return
  }
  // 判断是否是已存在，如果存在则不重复添加  || 排除首页
  if (tabList.find(v => v.path === fullPath) || /^\/home/.test(fullPath)) {
    return
  }
  // 判断是否是iframe
  let isIframe = fullPath.includes('/iframe?')
  // 添加页签同时将页签置为选中
  addTabPage({
    id: urlP.id || new Date().getTime().toString(),
    title: urlP.tabRouterName,
    path: isIframe ? urlP.url : fullPath,
    isIframe
  })
}
/**
 * 页签路由参数 Params 参数
 */
export function getRouteSearchParams() {
  const currentTab = getCurrentActiveTab()
  return currentTab.params || {}
}
/**
 * 页签路由参数 Query 参数
 */
export function getRouteSearchQuery() {
  let fullPath = window.location.href
  fullPath = fullPath.includes('#/') ? fullPath.split('#/')[1] : fullPath
  const urlP: any = urlParse(fullPath)
  return urlP
}

/**
 * 给当前页签添加拦截function  页签离开前
 * @param fn
 */
export function onTabRouteBeforClose(fn) {
  const { tabList, activeTab } = store.getState().tab
  const index = tabList.findIndex(v => activeTab === v.path)
  if (index < 0) {
    return
  }
  let newTabList = [...tabList]
  newTabList[index] = { ...newTabList[index], beforClose: fn }
  store.dispatch(setTabs(newTabList))
}

/**
 * 更新页签配置信息
 * @param id
 * @param newOpt
 */
export function updateTabConfigDataById(id, newOpt) {
  const { tabList } = store.getState().tab
  const index = tabList.findIndex(v => id === v.id)
  let newTabList = [...tabList]
  newTabList[index] = { ...newTabList[index], ...newOpt }
  store.dispatch(setTabs(newTabList))
}
