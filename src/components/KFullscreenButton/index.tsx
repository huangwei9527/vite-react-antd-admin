import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.less'
import screenfull from './screenfull'
import { addClass, hasClass, removeClass } from '@/utils/dom'
import { message } from 'antd'

interface Props {
  targetElementId?: string
}

const KFullscreenButton: FC<Props> = props => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  useEffect(() => {
    document.addEventListener(
      'keydown',
      function (e) {
        if (e.key === 'Esc') {
          setIsFullscreen(false)
          const $el = document.getElementById(props.targetElementId || '')
          if (!$el) {
            return
          }
          if (hasClass($el, 'fullscreen-container')) {
            removeClass($el, 'fullscreen-container')
          }
        }
      },
      false
    )
    screenfull.on('change', () => {
      if (!props.targetElementId) {
        setIsFullscreen(!!screenfull.isFullscreen)
      }
    })
  }, [props.targetElementId])
  const toggleFullscreen = () => {
    if (!props.targetElementId) {
      if (screenfull.isEnabled) {
        setIsFullscreen(!isFullscreen)
        screenfull.toggle()
      } else {
        message.warning('您的浏览器不支持全屏模式！')
      }
      return
    }
    const $el = document.getElementById(props.targetElementId || '')
    if (!$el) {
      return
    }
    if (hasClass($el, 'fullscreen-container')) {
      removeClass($el, 'fullscreen-container')
    } else {
      addClass($el, 'fullscreen-container')
    }
    setIsFullscreen(!isFullscreen)
  }
  return (
    <div className={styles.wrapper} onClick={toggleFullscreen}>
      {isFullscreen ? <i className="iconfont icon-quxiaoquanping" title="退出全屏"></i> : <i className="iconfont icon-quanping" title="全屏"></i>}
    </div>
  )
}

export default React.memo(KFullscreenButton)
