import React, { FC, useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './index.module.less'
import PageHeader from '@/components/page-header'
import SideBar from '@/components/side-bar'
import TabRoute from '@/components/tab-route'
import RouteViewContainer from '@/components/route-view-container'
import { getSystemInitDataAsync } from '@/store/modules/appSlice'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { Spin } from 'antd'
import { fetchCacheFromeLocalstorage } from '@/store/modules/localCacheSlice'
import eventBus, { EVENT_SYSTEM_READY } from '@/event-bus'
import { useLocation } from 'react-router'
import { urlParse } from '@/utils/util'
import { addTabPage, checkAndAddTabRoute } from '@/common/helps/tabRoute'
import { getMenuDataById, getMenuDataByName } from '@/config/menu'
import { getMenuCacheData } from '@/components/side-bar/menuData'

const Layout: FC = () => {
  const [hasInitSystem, setHasInitSystem] = useState(false)
  const dispatch = useAppDispatch()
  const { sidebarTheme, themeMode, isPageBorderRadius, showPageHeader, showTabRoute } = useAppSelector(store => store.localCache)
  const location = useLocation()
  /**
   * 容器初始化事件，初始化系统参数，及默认路由地址处理
   */
  const initLayoutEnterEvent = () => {
    // 模拟加载完成
    setTimeout(() => {
      setHasInitSystem(true)
    }, 300)
    // dispatch(getSystemInitDataAsync()).then(res => {
    //   if (!res) {
    //     return
    //   }
    //   let SYSTEM = res
    //   setHasInitSystem(true)
    //   eventBus.emit(EVENT_SYSTEM_READY)
    //   initDefaultPageRedirect()
    // })
  }
  const initDefaultPageRedirect = async () => {
    // 刷新页面回到首页, 路由参数keepRoute存在时直接打开目标页面
    const fullPath = window.location.href
    const urlP: any = urlParse(fullPath)
    // 如果路由上带有openViewName 则从菜单导航中查找页面配置参数，并打开页面
    if (urlP.keepRoute && urlP.openViewName) {
      let menuList = await getMenuCacheData()
      let itemRouterConfig = getMenuDataByName(urlP.openViewName, menuList)
      if (!itemRouterConfig) {
        return
      }
      addTabPage({
        id: itemRouterConfig.id,
        title: itemRouterConfig.title,
        path: itemRouterConfig.path,
        isIframe: itemRouterConfig.isIframe
      })
      return
    }
    // 如果路由上带有openViewId 则从菜单导航中查找页面配置参数，并打开页面
    if (urlP.keepRoute && urlP.openViewId) {
      let menuList: any = await getMenuCacheData()
      let itemRouterConfig = getMenuDataById(urlP.openViewId, menuList)
      if (!itemRouterConfig) {
        return
      }
      addTabPage({
        id: itemRouterConfig.id,
        title: itemRouterConfig.title,
        path: itemRouterConfig.path,
        isIframe: itemRouterConfig.isIframe
      })
      return
    }
    // 页面只有keepRoute则通过fullPath匹配是否打开页面
    if (!urlP.keepRoute || location.pathname === '/' || location.pathname === '/home') {
      return
    } else {
      checkAndAddTabRoute(fullPath)
    }
  }
  useEffect(() => {
    initLayoutEnterEvent()
    eventBus.on('APP_LAYOUT_REFRESH', () => {
      setHasInitSystem(false)
      setTimeout(() => {
        setHasInitSystem(true)
      }, 300)
    })
  }, [])
  return hasInitSystem ? (
    <div className={styles.wrapper}>
      <SideBar />
      <div
        className={classNames(styles.inner, {
          [styles.themeDark]: sidebarTheme === 'dark' && themeMode !== 'dark',
          [styles.isPageBorderRadius]: isPageBorderRadius
        })}
      >
        {showPageHeader && <PageHeader />}
        {showTabRoute && <TabRoute />}
        <RouteViewContainer />
      </div>
    </div>
  ) : (
    <div className={styles.wrapper + ' vertical-center'}>
      <Spin tip="Loading" size="large" />
    </div>
  )
}

export default Layout
