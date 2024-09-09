import { getCurrentActiveTab } from '@/common/helps/tabRoute'
import { useAppSelector } from '@/store/redux-hooks'
import { urlParse } from '@/utils/util'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import usePrevious from './usePrevious'

export const usePreviousTabRoute = () => {
  const { activeTab } = useAppSelector(store => store.tab)
  const previous = usePrevious(activeTab)
  return previous
}
/**
 * 页签再次被激活hooks
 * @param fn
 */
export const useTabRouteReactivate = (fn: () => void) => {
  const { activeTab } = useAppSelector(store => store.tab)
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) {
      ref.current = activeTab
      return
    }
    if (ref.current === activeTab) {
      fn?.()
    }
  }, [activeTab])
}
/**
 * 离开页签或者关闭页签
 * @param fn
 */
export const useTabRouteLeave = (fn: () => void) => {
  const { activeTab } = useAppSelector(store => store.tab)
  const [isActive, setIsActive] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current === null) {
      setIsActive(true)
      ref.current = activeTab
      return
    }
    if (ref.current === activeTab) {
      setIsActive(true)
      return
    }
    if (ref.current !== activeTab && isActive) {
      setIsActive(false)
      fn?.()
    }
  }, [activeTab])
  useEffect(() => {
    return () => {
      fn?.()
    }
  }, [])
}
