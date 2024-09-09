import React, { FC } from 'react'
import { Input } from 'antd'
import FilterItem from '@/components/filter-item'
import './index.less'

interface IProps {
  value: string
  onChange: (str: string) => void
  onSearch: () => void
  placeholder?: string
  label?: string
  labelWidth?: number
  style?: object
  allowClear?: boolean
}

const Component: FC<IProps> = props => {
  const search = () => {
    props.onSearch()
  }

  const handleBlur = () => {
    props.onSearch()
  }

  return (
    <FilterItem style={props.style} label={props.label} labelWidth={props.labelWidth}>
      <Input
        className="filter-item-search-input"
        allowClear={props.allowClear}
        value={props.value}
        title={props.value}
        placeholder={props.placeholder}
        onBlur={handleBlur}
        onPressEnter={search}
        onChange={e => props.onChange(e.target.value)}
      />
      <i onClick={search} className="iconfont icon-sousuo filter-item-search-icon"></i>
    </FilterItem>
  )
}

export default Component
