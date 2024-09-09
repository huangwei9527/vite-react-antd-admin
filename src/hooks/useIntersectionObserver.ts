import { useState, useEffect, useMemo } from 'react'
const useIntersectionObserver = (domRef: any) => {
  const [visible, setVisible] = useState(false)
  const intersectionObserver = useMemo(
    () =>
      new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.map(item => {
          if (item.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
          return item
        })
      }),
    []
  )
  useEffect(() => {
    if (domRef.current) {
      intersectionObserver.observe(domRef.current)
    }
  }, [domRef.current])
  useEffect(() => {
    return () => {
      // 清除监听
      intersectionObserver.disconnect()
    }
  }, [])
  return visible
}
export default useIntersectionObserver
