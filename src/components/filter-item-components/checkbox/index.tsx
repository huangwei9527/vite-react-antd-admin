import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Checkbox } from 'antd'
import styles from '../index.module.less'
import classNames from 'classnames'
import FilterItem, { IProps as FilterItemIProps } from '@/components/filter-item'
import { FoldVerticalItem } from '@/components/filter-fold-vertical'

type IValue = boolean

interface IProps {
  checked: IValue
  label: string | ReactNode
  onChange?: (value: IValue) => void
  style?: any
  foldMode?: 'vertical' | 'online' //  默认'online'
}

const Component: FC<IProps> = props => {
  const [value, setValue] = useState(props.checked)
  const FilterItemComponent = props.foldMode === 'vertical' ? FoldVerticalItem : FilterItem
  const handleChange = e => {
    let val = e.target.checked
    setValue(val)
    if (props.onChange) {
      props.onChange(val)
    }
  }
  useEffect(() => {
    setValue(props.checked)
  }, [props.checked])
  return (
    <div className={classNames(styles.filterItemWrappper, styles.filterCheckbox)} style={props.style}>
      <FilterItemComponent label={null} labelWidth={0}>
        <Checkbox onChange={v => handleChange(v)} checked={value}>
          {props.label}
        </Checkbox>
      </FilterItemComponent>
    </div>
  )
}

export default Component
