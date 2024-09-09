import { useEffect, useRef, useState } from 'react'
import type { BasicTarget } from '../utils/domTarget'
import { getTargetElement } from '../utils/domTarget'

export interface CursorState {
  screenX: number
  screenY: number
  clientX: number
  clientY: number
  pageX: number
  pageY: number
  elementX: number
  elementY: number
  elementH: number
  elementW: number
  elementPosX: number
  elementPosY: number
  isInTarget: boolean
}

const initState: CursorState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
  elementX: NaN,
  elementY: NaN,
  elementH: NaN,
  elementW: NaN,
  elementPosX: NaN,
  elementPosY: NaN,
  isInTarget: false
}

export default (target?: any) => {
  const [state, setState] = useState(initState)
  const $ref = useRef(null)
  $ref.current = target

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const { screenX, screenY, clientX, clientY, pageX, pageY } = event
      const newState = {
        isInTarget: false,
        screenX,
        screenY,
        clientX,
        clientY,
        pageX,
        pageY,
        elementX: NaN,
        elementY: NaN,
        elementH: NaN,
        elementW: NaN,
        elementPosX: NaN,
        elementPosY: NaN
      }
      const targetElement = $ref.current
      if (targetElement) {
        const { left, top, width, height } = targetElement.getBoundingClientRect()
        newState.elementPosX = left + window.pageXOffset
        newState.elementPosY = top + window.pageYOffset
        newState.elementX = pageX - newState.elementPosX
        newState.elementY = pageY - newState.elementPosY
        newState.elementW = width
        newState.elementH = height
        newState.elementW = width
        newState.isInTarget =
          newState.elementX >= 0 &&
          newState.elementX <= newState.elementW &&
          newState.elementY >= 0 &&
          newState.elementY <= newState.elementH
      }
      setState(newState)
    }
    window.document.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return state
}
