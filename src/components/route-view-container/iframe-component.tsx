import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '@/store/redux-hooks'
import { ITabItem } from '@/store/modules/tabSlice'
import { urlParse } from '@/utils/util'
import classNames from 'classnames'
import eventBus from '@/event-bus'
import { useTabRouteReactivate } from '@/hooks/useTabRoute'

interface Iprops {
  pageItem: ITabItem
}
const Component: FC<Iprops> = props => {
  const { activeTab } = useAppSelector(store => store.tab)
  const [path, setPath] = useState<string>()
  const iframeId = props.pageItem.id
  useEffect(() => {
    if (props?.pageItem?.isIframe) {
      let _path = urlParse(props.pageItem.path)['url']
      const vueIndexHtmlPosition = _path.indexOf('index.html#')
      if (vueIndexHtmlPosition !== -1) {
        let modifiedUrl =
          _path.slice(0, vueIndexHtmlPosition + 10) +
          `?random=${Math.floor(Math.random() * 100000)}` +
          _path.slice(vueIndexHtmlPosition + 10)
        setPath(modifiedUrl)
      } else {
        setPath(_path + (_path.includes('?') ? '&' : '?') + `random=${Math.floor(Math.random() * 100000)}`)
      }
    } else {
      setPath(props.pageItem.path)
    }
  }, [props.pageItem.path])

  /**
   *  iframe加载完成后初始化
   * @param isFirstLoad 是否第一次进入， 第一次需要触发一下eventBus，再次进入不需要重复触发
   */
  const handleIframeLoad = (isFirstLoad: boolean) => {
    console.log('iframe-page-enter')
  }
  useEffect(() => {
    setTimeout(() => {
      eventBus.emit('iframe-page-enter_' + iframeId)
    }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useTabRouteReactivate(() => {
    handleIframeLoad(false)
  })

  if (!path) {
    return null
  }

  return (
    <iframe
      style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}
      onLoad={() => {
        handleIframeLoad(true)
      }}
      src={path}
      frameBorder="0"
      id={iframeId}
      className={classNames(props.pageItem.path === activeTab ? 'active' : '')}
      title={props.pageItem.title}
    />
  )
}

export default Component
