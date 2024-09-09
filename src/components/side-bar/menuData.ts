/* eslint-disable eqeqeq */
import store from '@/store'
import { default as menuOriginData, getMenuDataById, IMenuItem } from '@/config/menu'
import { verifyPermission, PMCodes } from '@/config/permission-config'
import { queryFromArrayObj } from '@/utils/util'
import { cloneDeep } from 'lodash'

let menuList = cloneDeep(menuOriginData)
let cacheData = null // 做个缓存吧  如果已经生成了就不再次计算了
let isFetching = false
/**
 *
 * @returns {Promise<unknown>}
 */
export async function getMenuCacheData() {
  return new Promise(resolve => {
    setInterval(function () {
      if (cacheData) {
        resolve(cacheData)
      }
    }, 300)
  })
}

export function updateMenuCacheData(menusList) {
  menuList = cloneDeep(menuOriginData)
  cacheData = menusList
}

export default async function getMenuData() {
  if (cacheData) {
    return cacheData
  }

  if (isFetching) {
    let list = await getMenuCacheData()
    return list
  }
  isFetching = true
  menuList = relationTreeParentId(menuList)
  menuList = varifyAuthority(menuList)
  menuList = removeIsHideData(menuList) // 过滤掉isHide节点

  // do some thing支持异步的控制菜单

  cacheData = menuList
  isFetching = false
  return menuList
}

export function varifyAuthority(menu) {
  const { systemInitData } = store.getState().app
  let SYSTEM = systemInitData
  let isAdmin = SYSTEM.isAdmin
  let isReadSite = SYSTEM.isReadSite
  if (isAdmin && !isReadSite) return menu
  // 需要的可以根据系统参数来过滤掉没权限的菜单
  return menu
}
/**
 * 通过id移除指定路由
 * @param id
 * @returns {{dataRight: number[], menus: ([{isIframe: boolean, dataRight: string, id: string, href: string, title: string}, {isIframe: boolean, dataRight: string, id: string, href: string, title: string}, {isIframe: boolean, dataRight: string, id: string, href: string, title: string}]|[{isIframe: boolean, dataRight: string, id: string, href: string, title: string}, {isIframe: boolean, dataRight: string, id: string, href: string, title: string}])[], title: string, iconClass: string}|{isIframe: boolean, dataRight: string, id: string, href: string, title: string}|{isIframe: boolean, dataRight: string, id: string, href: string, title: string}|{isIframe: boolean, dataRight: string, id: string, href: string, title: string}|null}
 */
export function removeMenuById(menu, id) {
  let m = getMenuDataById(id, menu)
  if (m) {
    m.isHide = true
  }
  return menu
}

/**
 * 通过id显示指定路由
 * @param id
 * @returns {{dataRight: number[], menus: ([{isIframe: boolean, dataRight: string, id: string, href: string, title: string}, {isIframe: boolean, dataRight: string, id: string, href: string, title: string}, {isIframe: boolean, dataRight: string, id: string, href: string, title: string}]|[{isIframe: boolean, dataRight: string, id: string, href: string, title: string}, {isIframe: boolean, dataRight: string, id: string, href: string, title: string}])[], title: string, iconClass: string}|{isIframe: boolean, dataRight: string, id: string, href: string, title: string}|{isIframe: boolean, dataRight: string, id: string, href: string, title: string}|{isIframe: boolean, dataRight: string, id: string, href: string, title: string}|null}
 */
export function setShowMenuById(menu, id) {
  let m = getMenuDataById(id, menu)
  if (m) {
    m.isHide = false
  }
  return menu
}
/**
 * 通过id 批量移除指定路由
 * @param menu
 * @param ids
 * @returns {*[]}
 */
export function removeMenuByIds(menus = [], ids = []) {
  for (let i = 0, len = ids.length; i < len; i++) {
    removeMenuById(menus, ids[i])
  }
  return menus
}
export function setShowMenuByIds(menus = [], ids = []) {
  for (let i = 0, len = ids.length; i < len; i++) {
    setShowMenuById(menus, ids[i])
  }
  return menus
}

/**
 * 删除isHide节点
 * @param menu
 * @param id
 * @param newMenuData
 * @returns {*}
 */
export function removeIsHideData(menu) {
  menu = menu
    .filter(v => !v.isHide)
    .map(item => {
      if (!item.menus || item.menus.length === 0) {
        return item
      }
      item.menus = item.menus
        .filter(v => !v.isHide)
        .map(item2 => {
          if (!item2.menus || item2.menus.length === 0) {
            return item2
          }
          item2.menus = item2.menus.filter(v => !v.isHide)
          return item2
        })
      return item
    })
  return menu
}

/**
 * 修改导航数据
 * @param menu
 * @param id
 * @param newMenuData
 * @returns {*}
 */
export function updateMenuById(menu, id, newMenuData) {
  let m = getMenuDataById(id, menu)
  if (!m) {
    return
  }
  for (let key in newMenuData) {
    m[key] = newMenuData[key]
  }
  return menu
}

/**
 * 关联树状结构节点的parentId 方便其他组件对导航树操作
 * @param menu
 */
export function relationTreeParentId(menu) {
  menu.forEach(m => {
    let pid = m.id
    let rootId = m.id
    m.rootId = rootId
    if (m.menus) {
      m.menus.forEach(subM => {
        let subMPid = subM.id
        subM.pid = pid
        subM.rootId = rootId
        if (subM.menus) {
          subM.menus.forEach(item => {
            item.pid = subMPid
            item.rootId = rootId
          })
        }
      })
    }
  })
  return menu
}
