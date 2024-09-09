import React, { FC, useEffect, useState } from 'react'
import { Select } from 'antd'
import styles from '../index.module.less'
import FilterItem, { IProps as FilterItemIProps } from '@/components/filter-item'
import { IOptions } from '../type'
import { FoldVerticalItem } from '@/components/filter-fold-vertical'

type IValue = string | number | string[] | number[]

interface IProps extends FilterItemIProps {
  value: IValue
  options?: IOptions[]
  placeholder?: string
  allowClear?: boolean
  showSearch?: boolean
  maxTagCount?: number
  selectStyle?: any
  onChange?: (value: IValue, option?: IOptions, options?: IOptions[]) => void
  style?: any
  foldMode?: 'vertical' | 'online' //  默认'online'
}

const Component: FC<IProps> = props => {
  const [value, setValue] = useState(props.value)
  const FilterItemComponent = props.foldMode === 'vertical' ? FoldVerticalItem : FilterItem
  const borderType = props.foldMode === 'vertical' ? 'bordered' : 'none'
  const handleChange = val => {
    setValue(val || '')
    if (props.onChange) {
      let curOpt = props.options.find(v => v.value === val)
      props.onChange(val || '', curOpt, props.options)
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
        <Select
          className={styles.filterItemInput}
          showSearch={props.showSearch}
          optionFilterProp="children"
          maxTagCount={props.maxTagCount}
          allowClear={props.allowClear}
          placeholder={props.placeholder}
          value={value}
          style={props.selectStyle}
          onChange={val => handleChange(val || '')}
        >
          {(props.options || []).map(v => (
            <Select.Option key={v.value} value={v.value.toString()}>
              {v.label}
            </Select.Option>
          ))}
        </Select>
      </FilterItemComponent>
    </div>
  )
}

export default Component
