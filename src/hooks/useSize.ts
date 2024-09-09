import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>

type Size = { width: number; height: number }

export default function useSize(target: BasicTarget): Size | undefined {
  const [state, setState] = useState<Size | undefined>()
  const ref = useRef(0)
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver>()

  const setRafState = useCallback((value: Size | ((prevState?: Size) => Size)) => {
    cancelAnimationFrame(ref.current)

    ref.current = requestAnimationFrame(() => {
      setState(value)
    })
  }, [])

  useEffect(
    () => () => {
      resizeObserver?.disconnect()
      cancelAnimationFrame(ref.current)
    },
    [resizeObserver]
  )

  useLayoutEffect(() => {
    if (!target) return

    let targetEl: TargetValue<TargetType>
    if ('current' in target) {
      targetEl = target.current
    } else if (typeof target === 'function') {
      targetEl = target()
    } else {
      targetEl = target
    }

    if (!targetEl) return

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { clientWidth, clientHeight } = entry.target

        setRafState({
          width: clientWidth,
          height: clientHeight
        })
      })
    })

    setResizeObserver(resizeObserver)

    resizeObserver?.observe(targetEl)
  }, [setRafState, target])

  return state
}
