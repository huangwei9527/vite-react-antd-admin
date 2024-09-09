import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import useSize from '@/hooks/useSize'
import styles from './index.module.less'
import classnames from 'classnames'
import { throttle } from 'lodash'
export interface IRef {
  handleSwiperToLeft: () => void // 向左滑动
  handleSwiperToRight: () => void // 向右滑动
  moveToEnd: () => void // 滑动到最后一个
}
export interface IProps {
  children?: React.ReactNode | null
  hideSwitchBtn?: boolean // 是否显示左右切换按钮
  onVisibleSwitchTypeChange?: (string) => void // 左右按钮显示时回调方法  // left right left_and_right
  outoFixedEnd?: boolean // 当chrildren 变化时是否自动定位到最后一个
  style?: any
  handleSizeChange?: () => void
}
const Component = React.forwardRef<IRef, IProps>((props, ref) => {
  const refWrapper = useRef<HTMLDivElement>()
  const sizeWrapper = useSize(refWrapper)
  const refInner = useRef<HTMLDivElement>()
  const [showType, setShowType] = useState('') // left right left_and_right
  const [styleLeft, setStyleLeft] = useState(0)
  const handleClick = (type: string) => {
    const wrapperWidth = refWrapper.current.clientWidth
    const innerWidth = refInner.current.clientWidth
    // 边界判断
    if ((type === 'left' && styleLeft >= 0) || (type === 'right' && innerWidth <= styleLeft + wrapperWidth)) {
      return
    }
    if (type === 'right') {
      // 左滚动
      setStyleLeft(Math.max(styleLeft - 200, wrapperWidth - innerWidth))
    } else {
      // 右滚动
      setStyleLeft(Math.min(styleLeft + 200, 0))
    }
  }
  const reComputedSwitchBtnState = throttle(() => {
    if (!refWrapper || !refInner || !refWrapper.current) {
      return
    }
    const wrapperWidth = refWrapper.current.clientWidth
    const innerWidth = refInner.current.clientWidth
    let type = ''
    if (styleLeft < -1) {
      type += 'left'
    }
    if (innerWidth + styleLeft > wrapperWidth + 1) {
      type += 'right'
    }
    setShowType(type)
    if (props.onVisibleSwitchTypeChange) {
      props.onVisibleSwitchTypeChange(type)
    }
  }, 300)
  useImperativeHandle(ref, () => ({
    handleSwiperToLeft() {
      handleClick('left')
    },
    handleSwiperToRight() {
      handleClick('right')
    },
    moveToEnd() {
      const wrapperWidth = refWrapper.current.clientWidth
      const innerWidth = refInner.current.clientWidth
      if (innerWidth > wrapperWidth + 50) {
        setStyleLeft(Math.min(0, wrapperWidth - innerWidth))
      }
    },
    moveTo(x) {
      setStyleLeft(Math.min(0, x))
    }
  }))

  useEffect(() => {
    reComputedSwitchBtnState()
  }, [styleLeft, props.children])

  useEffect(() => {
    reComputedSwitchBtnState()
    if (props.handleSizeChange) {
      props.handleSizeChange()
    }
  }, [sizeWrapper])
  return (
    <div ref={refWrapper} className={styles.wrapper} style={props.style || {}}>
      <div ref={refInner} className={classnames(styles.inner, 'k-swiper-wrapper-inner')} style={{ left: `${styleLeft}px` }}>
        <>{props.children}</>
      </div>
      {!props.hideSwitchBtn && (
        <>
          {showType.includes('left') && (
            <div
              className={classnames(styles.btn, styles.leftBtn)}
              onClick={() => {
                handleClick('left')
              }}
            >
              <i className="iconcool zuoqie"></i>
            </div>
          )}
          {showType.includes('right') && (
            <div
              className={classnames(styles.btn, styles.rightBtn)}
              onClick={() => {
                handleClick('right')
              }}
            >
              <i className="iconcool youqie"></i>
            </div>
          )}
        </>
      )}
    </div>
  )
})

export default Component
