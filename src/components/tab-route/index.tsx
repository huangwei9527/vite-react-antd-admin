import React, { FC, useEffect, useRef, useState } from 'react'
import * as tabRouteHelps from '@/common/helps/tabRoute'
import { ITabItem } from '@/store/modules/tabSlice'
import { switchHideHeader } from '@/store/modules/appSlice'
import { useAppSelector } from '@/store/redux-hooks'
import SwiperWrapper from '@/components/swiper-wrapper'
import classNames from 'classnames'
import KFullscreenButton from '../KFullscreenButton'
import styles from './index.module.less'
import OptPopover from './optPopover'
import { useDispatch } from 'react-redux'
import usePrevious from '@/hooks/usePrevious'
import { CloseOutlined, DownCircleOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'

const RouteTab: FC = () => {
  const $swiper = useRef()
  const ref_wrapper: any = useRef()
  const ref_op: any = useRef()
  const [showType, setShowType] = useState('') // left right left_and_right
  const { activeTab, tabList } = useAppSelector(store => store.tab)
  const { hideHeader } = useAppSelector(store => store.app)
  const dispatch = useDispatch()
  const previousTablist = usePrevious(tabList)
  const handleTabClick = (tabItemData: ITabItem) => {
    tabRouteHelps.updateActiveTab(tabItemData.path)
  }
  const handleRemoveTab = (index, e) => {
    e.stopPropagation()
    tabRouteHelps.removeTab(tabList[index].path)
  }
  const handleScroll = (type: string) => {
    if (!$swiper || !$swiper.current) {
      return
    }
    if (type === 'left') {
      ;($swiper.current as any).handleSwiperToLeft()
    } else if (type === 'right') {
      ;($swiper.current as any).handleSwiperToRight()
    }
  }

  const handleContextMenuClick = (type: string, tabItemData?: ITabItem) => {
    const curTabData = tabItemData || tabList.find(v => v.path === activeTab)
    if (!curTabData) return
    switch (type) {
      case 'closeCurrent':
        tabRouteHelps.removeTab(curTabData.path)
        break
      case 'closeOther':
        tabRouteHelps.removeOthersTab(curTabData.path)
        break
      case 'closeAll':
        tabRouteHelps.removeAllTab()
        break
      case 'refresh':
        tabRouteHelps.refreshTab(curTabData.path)
        break
      default:
        break
    }
  }
  const handleVisibleSwitchTypeChange = type => {
    setShowType(type || '')
  }
  useEffect(() => {
    if (previousTablist && tabList.length > previousTablist.length) {
      ;($swiper.current as any).moveToEnd()
    }
  }, [tabList])
  // 58	BT-01135156首页，打开很多个页签后，之前打开的页签隐藏在左边，然后再点击隐藏页签对应的菜单，不会自动切换并显示隐藏的页签
  useEffect(() => {
    if (previousTablist && tabList.length > previousTablist.length) {
      return
    }
    const activeTabTarget = document.querySelector('.tabItemWrapper.active')
    const swiperWrapperTarget = document.querySelector('.k-swiper-wrapper-inner')
    if (!activeTabTarget || !swiperWrapperTarget || !ref_wrapper.current || !ref_op.current) {
      return
    }
    const activeTabClientRect = activeTabTarget?.getBoundingClientRect()
    const swiperWrapperClientRect = swiperWrapperTarget?.getBoundingClientRect()
    const wrapperClientRect = ref_wrapper.current.getBoundingClientRect()
    const ref_opClientRect = ref_op.current.getBoundingClientRect()
    // 判断是否在视口内  在视口内则return
    if (
      activeTabClientRect.left > wrapperClientRect.left &&
      activeTabClientRect.left < wrapperClientRect.left + wrapperClientRect.width
    ) {
      return
    }
    if (activeTabClientRect.left < wrapperClientRect.left) {
      ;($swiper.current as any).moveTo(wrapperClientRect.left - activeTabClientRect.left + swiperWrapperClientRect.left + 10)
      return
    }
    if (
      activeTabClientRect.left - ref_opClientRect.width + activeTabClientRect.width >
      wrapperClientRect.left + wrapperClientRect.width
    ) {
      ;($swiper.current as any).moveTo(
        swiperWrapperClientRect.left -
          wrapperClientRect.left -
          (activeTabClientRect.left + activeTabClientRect.width - wrapperClientRect.left - wrapperClientRect.width) -
          ref_opClientRect.width -
          10
      )
      return
    }
  }, [activeTab, tabList])
  return (
    <div className={styles.wrapper} ref={ref_wrapper} onClick={e => e.stopPropagation()}>
      <SwiperWrapper
        ref={$swiper}
        onVisibleSwitchTypeChange={handleVisibleSwitchTypeChange}
        hideSwitchBtn={true}
        outoFixedEnd={true}
        style={{ height: 32 }}
      >
        {tabList.map((item: ITabItem, index) => (
          <OptPopover
            trigger="contextMenu"
            handleClick={type => {
              handleContextMenuClick(type, item)
            }}
            key={item.path}
          >
            <div
              className={classNames('tabItemWrapper', {
                [styles.tabItemWrapper]: true,
                active: item.path === activeTab,
                [styles.active]: item.path === activeTab
              })}
              onClick={() => {
                handleTabClick(item)
              }}
            >
              <div
                className={classNames({
                  [styles.tabBtnWrapper]: true,
                  [styles.homeTab]: item.title === '首页'
                })}
              >
                {item.title === '首页' ? (
                  <i className="iconfont icon-home"></i>
                ) : (
                  <>
                    {item.title}
                    <span
                      onClick={e => {
                        handleRemoveTab(index, e)
                      }}
                      className={styles.closeIconBtn}
                    >
                      <CloseOutlined />
                    </span>
                  </>
                )}
              </div>
            </div>
          </OptPopover>
        ))}
        <div
          className={classNames({
            [styles.tabItemWrapper]: true,
            [styles.manageBtnW]: true,
            [styles.hide]: showType
          })}
        >
          <OptPopover
            handleClick={type => {
              handleContextMenuClick(type)
            }}
          >
            <div className={styles.tabManage}>
              <i className="iconfont icon-xiangxiazhankai"></i>
            </div>
          </OptPopover>
        </div>
      </SwiperWrapper>

      {/* 右侧操作按钮 */}
      <div className={styles.tabOptWrapper} ref={ref_op}>
        {showType && (
          <>
            <div className={styles.optItem + ' ' + styles.isFirst}>
              <OptPopover
                handleClick={type => {
                  handleContextMenuClick(type)
                }}
              >
                <div className={styles.tabManage}>
                  <i className="iconfont icon-xiangxiazhankai"></i>
                </div>
              </OptPopover>
            </div>
            <div
              className={classNames(styles.optItem, { [styles.disabled]: !showType.includes('left') })}
              onClick={() => {
                handleScroll('left')
              }}
            >
              <i className="iconfont icon-zuoqiehuan"></i>
            </div>
            <div
              className={classNames(styles.optItem, { [styles.disabled]: !showType.includes('right') })}
              onClick={() => {
                handleScroll('right')
              }}
            >
              <i className="iconfont icon-lirun-youqie"></i>
            </div>
          </>
        )}
        <div
          className={classNames(styles.optItem, styles.switchHideHeaderBtn)}
          onClick={() => {
            dispatch(switchHideHeader())
          }}
          title={hideHeader ? '展开页头' : '收起页头'}
        >
          <i className="iconfont icon-xiangzuo1" style={{ transform: hideHeader ? 'rotate(-90deg)' : 'rotate(90deg)' }}></i>
        </div>
        <div className={styles.optItem + ' ' + styles.KFullscreenButton}>
          <KFullscreenButton />
        </div>
      </div>
    </div>
  )
}

export default RouteTab
