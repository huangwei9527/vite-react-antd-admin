import { useState } from 'react'
import type { BasicTarget } from '@/utils/domTarget'
import { getTargetElement } from '@/utils/domTarget'
import useEffectWithTarget from './useEffectWithTarget'

export interface Options {
  rootMargin?: string
  threshold?: number | number[]
  root?: BasicTarget<Element>
}

function useInViewport(target: BasicTarget, options?: Options) {
  const [state, setState] = useState<boolean>() // 是否可见
  const [ratio, setRatio] = useState<number>()

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target)
      if (!el) {
        return
      }

      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            setRatio(entry.intersectionRatio) // 偏移量
            setState(entry.isIntersecting) // 是否出现在窗口中
          }
        },
        {
          ...options,
          root: getTargetElement(options?.root)
        }
      )

      observer.observe(el)

      return () => {
        observer.disconnect()
      }
    },
    [options?.rootMargin, options?.threshold],
    target
  )

  return [state, ratio] as const
}

export default useInViewport
