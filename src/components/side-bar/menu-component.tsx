import { getMenuDataById, IMenuItem } from '@/config/menu'
import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import { Popover, Tooltip } from 'antd'
import { useAppSelector } from '@/store/redux-hooks'
import classnames from 'classnames'
import { getCurrentActiveTab } from '@/common/helps/tabRoute'
import store from '@/store'
import { DialogBase } from '../dialogs/dialog-info'

interface Props {
  active?: string
  menuData: IMenuItem[]
  onMenuClick: Function
  className?: string
  currentObj?: any
}

const Item = props => {
  const { menuData, defaultIcon, onMenuClick } = props
  return (
    <div className={classnames(styles.popoverMenuWrapper, props.className || '')} onClick={e => e.stopPropagation()}>
      {menuData.map((subMenu, index) => {
        return (
          <div className={styles.popoverMenu} key={index}>
            <div>
              <div className={classnames({ [styles.popoverMenuItem]: true })}>
                <div className={styles.subMenuItemTitle}>
                  <span className={styles.subMenuItemTitleIcon}>
                    {subMenu.icon && <i className={subMenu.icon || defaultIcon} />}
                    {subMenu.iconImg && <img src={subMenu.iconImg} className={styles.iconImg + ' menu-icon-img'} alt="" />}
                  </span>
                  {subMenu.title}
                </div>
                {subMenu.menus.map(item => {
                  return (
                    <div
                      onClick={() => {
                        onMenuClick(item)
                      }}
                      className={styles.menuRouteLink}
                      key={item.id}
                    >
                      <span className={styles.linkSpan}>{item.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
const Layout: FC<Props> = props => {
  const { menuData, onMenuClick } = props
  const { sidebarCollapsed } = useAppSelector(store => store.localCache)
  const { activeTab } = useAppSelector(store => store.tab)
  const [activeRootId, setActiveRootId] = useState('')
  const { systemInitData } = store.getState().app
  useEffect(() => {
    const selectActiveTab = getCurrentActiveTab()
    if (selectActiveTab && selectActiveTab.rootId) {
      setActiveRootId(selectActiveTab.rootId)
      return
    }
    const menuItemData = getMenuDataById(selectActiveTab?.id || '', menuData || [])
    if (menuItemData) {
      setActiveRootId(menuItemData?.rootId || '')
    } else {
      setActiveRootId('')
    }
  }, [activeTab, menuData])
  return (
    <>
      <div className={styles.sidebarMenuWrapper}>
        {menuData.map((menu, index) => {
          return menu.menus && menu.menus.length > 0 ? (
            <Popover
              placement="rightTop"
              arrow={false}
              content={
                <Item
                  currentObj={props?.currentObj}
                  menuData={menu.menus}
                  defaultIcon={menu.icon}
                  onMenuClick={onMenuClick}
                  systemInitData={systemInitData}
                />
              }
              mouseEnterDelay={0}
              key={menu.id}
              overlayClassName="sideBarSubMenuPopover"
            >
              <div className={classnames(styles.menuItem, 'menu-item', { [styles.active]: activeRootId === menu.id })}>
                {<i className={styles.icon + ' ' + (menu.icon || '')} />}
                {menu.icon && <i className={styles.icon_active + ' ' + (menu.icon_active || menu.icon || '')} />}
                <span className={styles.itemTit}>{!sidebarCollapsed ? menu.title : ''}</span>
              </div>
            </Popover>
          ) : (
            <div
              key={index}
              className={classnames(styles.menuItem, 'menu-item', { [styles.active]: activeRootId === menu.id })}
              onClick={() => {
                onMenuClick(menu)
              }}
            >
              {menu.icon && <i className={styles.icon + ' ' + (menu.icon || '')} />}
              {menu.icon && <i className={styles.icon_active + ' ' + (menu.icon_active || menu.icon || '')} />}
              {menu.iconImg && <img src={menu.iconImg} className={styles.iconImg + ' menu-icon-img'} alt="" />}
              <span className={styles.itemTit} style={menu.title.length > 3 ? { letterSpacing: 0 } : {}}>
                {!sidebarCollapsed ? menu.title : ''}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Layout
