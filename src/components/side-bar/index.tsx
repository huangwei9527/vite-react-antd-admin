import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import getMenuData, { updateMenuCacheData } from './menuData'
import MenuComponent from './menu-component'
import { IMenuItem, getMenuDataById } from '@/config/menu'
import { verifyPermission } from '@/config/permission-config'
import { addTabPage } from '@/common/helps/tabRoute'
import { ITabItem } from '@/store/modules/tabSlice'
import classNames from 'classnames'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import { updateLocalstorageCache } from '@/store/modules/localCacheSlice'
import $eventBus, { EVENT_SIDEBAR_MENU_CLICK, EVENT_SIDEBAR_MENU_CONFIG } from '@/event-bus'
import ToggleTheme from '../app-setting/toggle-theme'
import logoImage from '../../assets/images/logo.png'
import SettingIcon from '../app-setting/setting-icon'
import ToggleSidebarCollapsed from '../app-setting/toggle-sidebar-collapsed'

const SideBar: FC = () => {
  const [menus, setMenus] = useState([])
  const { sidebarCollapsed, sidebarTheme, themeMode, showSidebarLogo } = useAppSelector(s => s.localCache)
  const dispatch = useAppDispatch()

  /**
   * 点击导航链接
   * @param menuConf
   */
  const handleClick = (routeConfig: IMenuItem) => {
    // 权限控制
    let permissionCode = Array.isArray(routeConfig.dataRight) ? routeConfig.dataRight : [routeConfig.dataRight]
    permissionCode = permissionCode.map(v => {
      return v ? Number(v) : ''
    })
    if (!verifyPermission(permissionCode, true)) {
      return
    }
    //页面跳转
    addTabPage(routeConfig as ITabItem)
  }

  useEffect(() => {
    getMenuData()
      .then(menuList => {
        setMenus(menuList)
      })
      .catch(e => {
        console.log(e)
      })

    // 事件
    $eventBus.on(EVENT_SIDEBAR_MENU_CLICK, id => {
      getMenuData().then(menuList => {
        let queryInMenus = getMenuDataById(id as any, menuList)
        if (queryInMenus) {
          handleClick(queryInMenus)
        }
      })
    })
    $eventBus.on('GET_SIDEBAR_MENU_DATA', (callback: any) => {
      getMenuData().then(menuList => {
        if (callback) {
          callback(menuList)
        }
      })
    })
    $eventBus.on(EVENT_SIDEBAR_MENU_CONFIG, (cb: any) => {
      getMenuData().then(menuList => {
        let newMenus = cb(menuList)
        updateMenuCacheData([...newMenus])
        setMenus(newMenus)
      })
    })
    return () => {
      $eventBus.off(EVENT_SIDEBAR_MENU_CLICK)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      onClick={e => e.stopPropagation()}
      className={classNames({
        [styles.wrapper]: true,
        [styles.themeLight]: sidebarTheme === 'light' || themeMode === 'dark',
        [styles.themeDark]: sidebarTheme === 'dark' && themeMode !== 'dark',
        [styles.sidebarCollapsed]: sidebarCollapsed
      })}
    >
      {showSidebarLogo && (
        <div className={styles.logo}>
          <img src={logoImage} alt="" />
        </div>
      )}

      <div className={styles.container}>
        <MenuComponent menuData={menus} onMenuClick={handleClick} />
      </div>
      <div className={styles.opWrapper}>
        <ul className={classNames({ 'text-center': sidebarCollapsed })}>
          <li className={styles.bottomMenuBtnWrapper}>
            <div className={styles.bottomMenuBtn}>
              <SettingIcon />
            </div>
            <div className={styles.bottomMenuBtn}>
              <ToggleTheme />
            </div>
            <div className={styles.bottomMenuBtn}>
              <ToggleSidebarCollapsed />
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SideBar
