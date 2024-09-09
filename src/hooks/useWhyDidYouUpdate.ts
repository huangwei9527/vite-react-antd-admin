import { useEffect, useRef } from 'react'
export default function useWhyDidYouUpdate(componentName, props) {
  const prevProps = useRef({})

  useEffect(() => {
    if (prevProps.current) {
      // 提取新旧 props 的属性，生成数组
      const allKeys = Object.keys({ ...prevProps.current, ...props })
      const changedProps = {}
      allKeys.forEach(key => {
        // 对比 新旧 prop[key]，如果不同，记录到对象中
        if (!Object.is(prevProps.current[key], props[key])) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key]
          }
        }
      })

      if (Object.keys(changedProps).length) {
        // 输出到控制台
        console.log('[why-did-you-update]', componentName, changedProps)
      }
    }

    // 更新 prevProps
    prevProps.current = props
  })
}
