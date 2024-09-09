import React, { DetailedHTMLProps, FC, HTMLAttributes, ReactNode, useCallback, useRef, useState } from 'react'
import classnames from 'classnames'
import styles from './index.module.less'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { updateLocalstorageCache } from '@/store/modules/localCacheSlice'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'

interface IProps {
  className?: string
  siderPlacement?: 'left' | 'right' // 侧边栏位置
  children: ReactNode
  sider: ReactNode
  siderWidth?: number
  style?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  siderStyle?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  tableStyle?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  pageId?: string // 是否将拖动的宽度记住， 传了pageId则根据pageId来缓存用户操作
}

const Layout: FC<IProps> = props => {
  const dispatch = useAppDispatch()
  const { splitPanelLayoutWidth = {} } = useAppSelector(s => s.localCache)
  const { pageId, siderPlacement = 'left', siderWidth = 200 } = props
  const outerWrapper = useRef(null)
  const siderWrapper = useRef(null)
  const refDrag = useRef()
  const [show, setShow] = useState(true)
  // 优先取缓存中用户自定义设置的宽度
  const [width, setWidth] = useState(pageId && splitPanelLayoutWidth[pageId] ? Number(splitPanelLayoutWidth[pageId]) : siderWidth)
  const [isMoving, setIsMoving] = useState(false)
  const offsetStartCache = useRef(0)
  const widthCache = useRef(0)
  const handleDisplayClick = () => {
    setShow(!show)
  }

  const handleMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      // 将鼠标移动距离与offset进行处理
      const dragOffset = e.pageX
      let offset = (dragOffset - offsetStartCache.current) * (siderPlacement === 'left' ? 1 : -1)
      let wValue = widthCache.current + offset
      wValue = Math.max(0, wValue)
      wValue = Math.min(wValue, outerWrapper.current.clientWidth)
      setWidth(wValue)
    },
    [siderPlacement]
  )
  const handleUp = useCallback(
    (e: MouseEvent) => {
      setIsMoving(false)
      updateUserSetSiderWidth(siderWrapper.current.clientWidth)
      document.removeEventListener('mouseup', handleUp)
      document.removeEventListener('mousemove', handleMove)
    },
    [siderPlacement, handleMove]
  )
  const handleMousedown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      offsetStartCache.current = e.pageX
      widthCache.current = siderWrapper.current.clientWidth
      setIsMoving(true)
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleUp)
    },
    [siderPlacement, handleMove, handleUp]
  )

  const updateUserSetSiderWidth = w => {
    if (pageId) {
      dispatch(updateLocalstorageCache({ splitPanelLayoutWidth: { ...splitPanelLayoutWidth, [pageId]: w } }))
    }
  }

  return (
    <div
      className={classnames(styles.wrapper, { [styles.siderRight]: siderPlacement === 'right', [styles.hideSider]: !show })}
      ref={outerWrapper}
      style={{ ...(props.style || {}) }}
    >
      <div className={styles.sider} style={{ ...(props.siderStyle || {}), width }} ref={siderWrapper}>
        <div className={styles.siderContent}>{props.sider}</div>
        <div
          className={classnames(styles.siderDrag, { [styles.isMoving]: isMoving })}
          ref={refDrag}
          onMouseDown={handleMousedown}
        ></div>
      </div>
      <div className={styles.content} style={{ ...(props.tableStyle || {}), width: `calc(100% - ${width + (show ? 12 : 0)}px)` }}>
        <div className={styles.siderDisplayBtn} onClick={handleDisplayClick}>
          {(show && siderPlacement === 'left') || (!show && siderPlacement === 'right') ? (
            <DoubleLeftOutlined />
          ) : (
            <DoubleRightOutlined />
          )}
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default React.memo(Layout)
