import React, { FC, useEffect, useState } from 'react'
import { Input } from 'antd'
import styles from '../index.module.less'
import FilterItem, { IProps as FilterItemIProps } from '@/components/filter-item'
import { FoldVerticalItem } from '@/components/filter-fold-vertical'

type IValue = string

interface IProps extends FilterItemIProps {
  value: IValue
  placeholder?: string
  inputStyle?: any
  onChange?: (value: IValue) => void
  foldMode?: 'vertical' | 'online' //  默认'online'
}

const Component: FC<IProps> = props => {
  const [value, setValue] = useState(props.value)
  const FilterItemComponent = props.foldMode === 'vertical' ? FoldVerticalItem : FilterItem
  const handleChange = val => {
    setValue(val)
    if (props.onChange) {
      props.onChange(val)
    }
  }
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  return (
    <div className={styles.filterItemWrappper} style={props.style}>
      <FilterItemComponent
        label={props.label}
        valueWidth={props.valueWidth as number}
        style={props.style}
        disabled={props.disabled}
        labelWidth={
          (props.labelWidth as number) ||
          ((props.label && typeof props.label === 'string' ? props.label.length * 16 : 60) as number)
        }
      >
        <Input
          className={styles.filterItemInput}
          style={props.inputStyle}
          value={value}
          disabled={props.disabled}
          placeholder={props.placeholder || ''}
          onPressEnter={v => handleChange(value)}
          onChange={v => handleChange(v.target.value)}
        />
      </FilterItemComponent>
    </div>
  )
}

export default Component
