import type { MutableRefObject } from 'react'
import { isBrowser, isFunction } from './util'

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>

export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!isBrowser) {
    return undefined
  }

  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (isFunction(target)) {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}

const checkIfAllInShadow = (targets: BasicTarget[]): boolean => {
  return targets.every(item => {
    const targetElement = getTargetElement(item)
    if (!targetElement) return false
    if (targetElement.getRootNode() instanceof ShadowRoot) return true
  })
}

const getShadow = (node: TargetValue<Element>) => {
  if (!node) {
    return document
  }
  return node.getRootNode()
}

export const getDocumentOrShadow = (target: BasicTarget | BasicTarget[]): Document | Node => {
  if (!target || !document.getRootNode) {
    return document
  }

  const targets = Array.isArray(target) ? target : [target]

  if (checkIfAllInShadow(targets)) {
    return getShadow(getTargetElement(targets[0]))
  }

  return document
}
