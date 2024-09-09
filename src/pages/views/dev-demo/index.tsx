/*
 * @Author: w_huang w_huang@kingdee.com
 * @Date: 2023-12-30 15:07:46
 * @LastEditors: w_huang w_huang@kingdee.com
 * @LastEditTime: 2024-01-31 12:31:16
 * @FilePath: \youshang-kuaiji-web-new-flow\src\pages\views\dev-demo\index.tsx
 */
import React, { FC, useEffect, useState, useRef, useCallback, Suspense } from 'react'
import styles from './index.module.less'
import classnames from 'classnames'
import { Button } from 'antd'
import pageDemo from './page-demo'
import SplitPanelLayout from '@/components/SplitPanelLayout'

const typeConfig: any = {
  page: pageDemo
}

const Component: FC = () => {
  const [show, setShow] = useState(true)
  const [type, setType] = useState('page')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const CurrentComponent = currentIndex > (typeConfig[type] || []).length - 1 ? null : typeConfig[type][currentIndex].component
  if (fullscreen) {
    return <CurrentComponent key="1" />
  }
  return (
    <div className="app-page1">
      <div className="app-page1-filter app-page1-filter-fix-height">
        <div className="app-page1-filter-container-btns">
          {type === 'page' && <Button onClick={() => setFullscreen(true)}>全屏预览</Button>}
        </div>
      </div>
      <div className="app-page1-table">
        <SplitPanelLayout
          siderWidth={228}
          sider={
            <div className={styles.tableLeftContent}>
              <ul>
                {(typeConfig[type] || []).map((v, i) => {
                  return (
                    <li
                      key={i}
                      className={classnames({ [styles.active]: currentIndex === i })}
                      onClick={() => setCurrentIndex(i)}
                    >
                      <div>
                        {i + 1}、{v.title}
                      </div>
                      <div className={styles.liDesc}>{v.description}</div>
                    </li>
                  )
                })}
              </ul>
            </div>
          }
        >
          <div className={classnames(styles.tableRight)}>
            <CurrentComponent key="2" />
          </div>
        </SplitPanelLayout>
      </div>
    </div>
  )
}

export default Component
