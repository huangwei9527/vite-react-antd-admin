import React, { FC, ReactNode } from 'react'
import classnames from 'classnames'
import './index.less'

export interface IProps {
  label?: string | ReactNode | any
  labelWidth?: number | string
  valueWidth?: number | string
  style?: object
  valueStyle?: object
  disabled?: boolean // 是否被禁用
  [key: string]: any
}

const FilterItem: FC<IProps> = props => {
  const defaultLabelWidth = () => {
    let width = 108
    if (!props?.label) {
      width = 0
      return '0px'
    }
    if (typeof props?.labelWidth === 'string') {
      return props?.labelWidth
    }
    if (props?.labelWidth === 0 || props?.labelWidth > 0) {
      width = props?.labelWidth
      return `${width}px`
    }
    return `${width}px`
  }
  const defaultValueWidth = () => {
    if (props?.valueWidth === undefined) {
      return 'auto'
    }
    if (typeof props?.valueWidth === 'string') {
      return props?.valueWidth
    }
    if (props?.valueWidth === 0 || props?.valueWidth > 0) {
      return `${props?.valueWidth}px`
    }
    return `${props?.valueWidth}px`
  }
  return (
    <div style={props?.style} className={classnames('app-filter-item-box', { disabled: props.disabled })}>
      <div
        style={{ ...(props.valueStyle || {}), width: defaultLabelWidth() }}
        title={typeof props.label === 'string' ? props.label : ''}
        className="app-filter-item-box-label"
      >
        {props.label}
      </div>
      <div style={{ width: defaultValueWidth() }} className="app-filter-item-box-content">
        {props.children}
      </div>
    </div>
  )
}

export default FilterItem
