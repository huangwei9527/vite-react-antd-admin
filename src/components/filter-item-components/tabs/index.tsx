import React, { FC, useState } from 'react'
import { Radio } from 'antd'
import styles from '../index.module.less'
import { IOptions } from '../type'
import classNames from 'classnames'

type IValue = string | number

interface IProps {
  value: string | number
  options?: IOptions[]
  onChange?: (value: IValue, option?: IOptions, options?: IOptions[]) => void
  style?: any
}

const Component: FC<IProps> = props => {
  const handleChange = val => {
    if (props.onChange) {
      let curOpt = props.options.find(v => v.value === val)
      props.onChange(val, curOpt, props.options)
    }
  }
  return (
    <div className={classNames(styles.filterItemWrappper, styles.widthUnset)} style={props.style}>
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        value={props.value}
        onChange={e => {
          handleChange(e.target.value)
        }}
      >
        {(props.options || []).map(v => {
          return (
            <Radio.Button key={v.value} value={v.value}>
              {v.label}
            </Radio.Button>
          )
        })}
      </Radio.Group>
    </div>
  )
}

export default Component
