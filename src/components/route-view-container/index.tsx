/* eslint-disable eqeqeq */
import React, { FC, Suspense, useEffect, useRef } from 'react'
import styles from './index.module.less'
import { getRouteByPath } from '@/router'
import { useAppSelector } from '@/store/redux-hooks'
import { ITabItem } from '@/store/modules/tabSlice'
import classNames from 'classnames'
import ErrorBound from '@/components/error-boundary'
import IframeComponent from './iframe-component'
import eventBus from '@/event-bus'

const PageComponent = React.memo((props: { pageItem: ITabItem; isActive: boolean }) => {
  const refWrapper = useRef(null)
  const { reloadPath } = useAppSelector(store => store.tab)
  const currentRoute = getRouteByPath(props.pageItem.path)
  const getStyle = page => {
    let style = page.isIframe
      ? {
          padding: '',
          ...(props.isActive
            ? {
                visibility: 'visible'
              }
            : {
                visibility: 'hidden',
                opacity: 0,
                position: 'absolute',
                left: -99999,
                top: -99999,
                zIndex: -1000
              })
        }
      : {
          display: props.isActive ? 'block' : 'none',
          padding: ''
        }
    let route = getRouteByPath(page.path)
    if (route && route.meta) {
      let meta = route.meta
      if (meta.noPadding) {
        style.padding = '0'
      }
    }
    return style
  }
  return (
    <div
      ref={refWrapper}
      className={classNames(
        props.pageItem.isIframe ? styles.contentIframe + ' page-iframe-wrapper' : styles.content,
        props.pageItem.id.replace(/\//g, '_')
      )}
      style={getStyle(props.pageItem) as any}
      key={props.pageItem.id}
    >
      {reloadPath === props.pageItem.path ? null : props.pageItem.isIframe ? (
        <IframeComponent pageItem={props.pageItem} />
      ) : (
        <Suspense fallback={<></>}>
          <ErrorBound>
            <currentRoute.component />
          </ErrorBound>
        </Suspense>
      )}
    </div>
  )
})

const RouterViewContainer: FC = () => {
  const { activeTab, tabList } = useAppSelector(store => store.tab)
  useEffect(() => {
    let tab = tabList.find(x => x.path === activeTab)
    eventBus.emit('ACTIVE-TAB-CHANGE', tab)
  }, [activeTab])
  return (
    <div id="page-container-content-unique-id" className={classNames('page-container-content', styles.wrapper)}>
      {tabList.map(page => {
        return <PageComponent key={page.id + page.path} pageItem={page} isActive={page.path === activeTab} />
      })}
    </div>
  )
}

export default RouterViewContainer
