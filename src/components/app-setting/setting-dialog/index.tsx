import React, { FC, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Drawer, Switch } from 'antd'
import styles from './index.module.less'
import classNames from 'classnames'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { updateLocalstorageCache } from '@/store/modules/localCacheSlice'
import ProviderStoreComponent from '@/components/ProviderStoreComponent'
import { appThemeColors, defaultThemeColor } from '@/const'
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons'

export interface IProps {
  visible?: boolean
  remove?: () => void
  [key: string]: any
}

const Component: FC<IProps> = props => {
  const [visible] = useState(props.visible)
  const dispatch = useAppDispatch()
  const {
    sidebarCollapsed,
    sidebarTheme,
    themeColor,
    themeMode,
    showSidebarLogo,
    showTabRoute,
    showPageHeader,
    isPageBorderRadius
  } = useAppSelector(s => s.localCache)
  const handleUpdateSetting = obj => {
    dispatch(updateLocalstorageCache(obj))
  }
  // 取消
  const onClose = () => {
    props.remove()
  }
  return (
    <Drawer title="应用设置" width={300} onClose={onClose} open={visible}>
      <div className={styles.items}>
        <p className={styles.itemsTitle}>菜单设置</p>
        <div className={styles.sidebarItemWrapper}>
          <div
            className={classNames(styles.sidebarItem, { [styles.active]: sidebarTheme === 'dark' })}
            onClick={() => handleUpdateSetting({ sidebarTheme: 'dark' })}
          >
            <div className={classNames(styles.sidebarItemL, styles.dark)}></div>
            <div className={classNames(styles.sidebarItemR)}></div>
          </div>
          <div
            className={classNames(styles.sidebarItem, { [styles.active]: sidebarTheme === 'light' })}
            onClick={() => handleUpdateSetting({ sidebarTheme: 'light' })}
          >
            <div className={classNames(styles.sidebarItemL)}></div>
            <div className={classNames(styles.sidebarItemR)}></div>
          </div>
        </div>
      </div>
      <div className={styles.items}>
        <p className={styles.itemsTitle}>主题设置</p>
        <div>
          <p className={styles.itemsTitle2}>主题色</p>
          <div className={styles.colorThemeWrapper}>
            {appThemeColors.map(v => {
              return (
                <div
                  key={v}
                  className={classNames(styles.colorThemeItem, { [styles.active]: v === themeColor })}
                  style={{ background: v }}
                  onClick={() => handleUpdateSetting({ themeColor: v })}
                >
                  {defaultThemeColor === v && <span className={styles.colorThemeItemText}>默认</span>}

                  {v === themeColor && (
                    <span className={styles.hasCheked}>
                      <CheckCircleOutlined />
                    </span>
                  )}
                </div>
              )
            })}
            <div></div>
          </div>
          <div className={styles.formItem}>
            <div>暗黑模式</div>
            <Switch
              checked={themeMode === 'dark'}
              onChange={checked => handleUpdateSetting({ themeMode: checked ? 'dark' : 'light' })}
            />
          </div>
        </div>
        <div></div>
      </div>
      <div className={classNames(styles.items, styles.itemsLayout)}>
        <p className={styles.itemsTitle}>布局设置</p>
        <div>
          <div className={styles.formItem}>
            <div>LOGO显示</div>
            <Switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              checked={showSidebarLogo}
              onChange={checked => handleUpdateSetting({ showSidebarLogo: checked })}
            />
          </div>
          <div className={styles.formItem}>
            <div>左侧菜单</div>
            <Switch
              checkedChildren="展开"
              unCheckedChildren="收起"
              checked={!sidebarCollapsed}
              onChange={checked => handleUpdateSetting({ sidebarCollapsed: !checked })}
            />
          </div>
          <div className={styles.formItem}>
            <div>页签显示</div>
            <Switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              checked={showTabRoute}
              onChange={checked => handleUpdateSetting({ showTabRoute: checked })}
            />
          </div>
          <div className={styles.formItem}>
            <div>Header显示</div>
            <Switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              checked={showPageHeader}
              onChange={checked => handleUpdateSetting({ showPageHeader: checked })}
            />
          </div>
          <div className={styles.formItem}>
            <div>页面容器圆角</div>
            <Switch
              checkedChildren="圆角"
              unCheckedChildren="直角"
              checked={isPageBorderRadius}
              onChange={checked => handleUpdateSetting({ isPageBorderRadius: checked })}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}

function DialogComponent(options: IProps) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  root.render(
    React.createElement(ProviderStoreComponent(Component), {
      ...options,
      visible: true,
      remove: () => {
        root.unmount()
        document.body.removeChild(div)
      }
    })
  )
}
export default DialogComponent
