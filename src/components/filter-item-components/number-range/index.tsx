import React, { FC, useEffect, useState } from 'react'
import { Input, InputNumber } from 'antd'
import styles from '../index.module.less'
import FilterItem, { IProps as FilterItemIProps } from '@/components/filter-item'
import { FoldVerticalItem } from '@/components/filter-fold-vertical'

type IValue = [string, string] | [number, number]

interface IProps extends FilterItemIProps {
  value: IValue
  placeholder?: [string, string]
  inputStyle?: any
  onChange?: (value: IValue) => void
  leftNumberInputProps?: any // 更多属性请参考 NumberInput
  rightNumberInputProps?: any // 更多属性请参考 NumberInput
  foldMode?: 'vertical' | 'online' //  默认'online'
}

const Component: FC<IProps> = props => {
  const [value, setValue] = useState(props.value)
  const FilterItemComponent = props.foldMode === 'vertical' ? FoldVerticalItem : FilterItem
  const borderType = props.foldMode === 'vertical' ? 'bordered' : 'none'
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
        <div className={styles.rangeWrapper}>
          <div className={styles.rangeLInput}>
            <InputNumber
              style={props.inputStyle}
              value={value[0]}
              placeholder={props.placeholder ? props.placeholder[0] : '请输入'}
              borderType={borderType}
              onChange={v => handleChange([v, value[1]])}
              {...(props.leftNumberInputProps || {})}
            />
          </div>
          <div className={styles.rangeCText}>至</div>
          <div className={styles.rangeRInput}>
            <InputNumber
              style={props.inputStyle}
              value={value[1]}
              placeholder={props.placeholder ? props.placeholder[1] : '请输入'}
              borderType="none"
              onChange={v => handleChange([value[0], v])}
              {...(props.rightNumberInputProps || {})}
            />
          </div>
        </div>
      </FilterItemComponent>
    </div>
  )
}

export default Component
