import { useState } from 'react'
import useEventListener from './useEventListener'
import type { BasicTarget } from '../utils/domTarget'

export interface Options {
  onEnter?: () => void
  onLeave?: () => void
  onChange?: (isHovering: boolean) => void
}

export default (target: BasicTarget, options?: Options): boolean => {
  const { onEnter, onLeave, onChange } = options || {}

  const [state, setState] = useState(false)

  useEventListener(
    'mouseenter',
    () => {
      onEnter?.()
      setState(true)
      onChange?.(true)
    },
    {
      target
    }
  )

  useEventListener(
    'mouseleave',
    () => {
      onLeave?.()
      setState(false)
      onChange?.(false)
    },
    {
      target
    }
  )

  return state
}
