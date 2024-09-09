import React, { FC, useState, useRef, useEffect, useCallback } from 'react'
import { Select, Input } from 'antd'
import FilterItem from '../filter-item/index'
import styles from './index.module.less'

interface IList {
  param?: string // 对应的字段名
  placeholder?: string // 不传 placeholder 则input默认为 name 值， 传了则为 placeholder
  name: string
  key: number // key 值从1开始，下标值+1，不能随意命名
}

interface ISearch {
  value: string
  key: number
}

interface IProps {
  value?: any
  list: IList[]
  onChange: (obj: ISearch) => void
  style?: object
  inputWidth?: number
  blurSearch?: boolean
  searchClear?: boolean
  fontSize?: number
  notTrim?: boolean
}

const { Option } = Select
const arrowWidth = 30
const inputStyle = {
  paddingRight: '18px'
}
const Component: FC<IProps> = ({ blurSearch = true, searchClear = false, ...props }) => {
  const [selectValue, setSelectValue] = useState(props?.value ? props?.value : props.list[0].key)
  const [labelWidth, setLabelWidth] = useState(props.list[0].name.length * 15 + arrowWidth)
  const [txt, setTxt] = useState('')
  const ref_pre_txt = useRef('')
  const ref_is_blur = useRef(false)

  const search = () => {
    ref_pre_txt.current = txt
    const cur = props.list.find(l => l.key === selectValue)
    props.onChange({
      ...cur,
      value: txt,
      key: selectValue
    })
    setTimeout(() => {
      ref_is_blur.current = false
    }, 200)
    searchClear && setTxt('')
  }

  useEffect(() => {
    if (props.value) {
      setSelectValue(props.value)
      setLabelWidth(props.list[Number(props.value) - 1].name.length * 15 + arrowWidth)
      setTxt('')
    }
  }, [props.value])

  const handleBlur = () => {
    if (!blurSearch) return
    if (ref_pre_txt.current === txt) return
    ref_is_blur.current = true
    search()
  }

  const renderSelect = () => {
    return (
      <Select
        className={props.fontSize ? styles.select : ''}
        value={selectValue}
        dropdownStyle={{ width: 'auto' }}
        onChange={value => {
          setSelectValue(Number(value))
          setLabelWidth(props.list[Number(value) - 1].name.length * 15 + arrowWidth)
          setTxt('')
        }}
      >
        {props.list.map(l => (
          <Option key={l.key} value={l.key}>
            {l.name}
          </Option>
        ))}
      </Select>
    )
  }
  const placeholder = useCallback(() => {
    return props.list[selectValue - 1]?.placeholder ? props.list[selectValue - 1]?.placeholder : props.list[selectValue - 1]?.name
  }, [selectValue])
  return (
    <FilterItem style={props.style} labelWidth={labelWidth} label={renderSelect()}>
      <Input
        style={{ ...inputStyle, width: (props.inputWidth || 130) + 'px' }}
        value={txt}
        title={txt}
        placeholder={placeholder()}
        onPressEnter={search}
        onBlur={handleBlur}
        onChange={e => {
          setTxt(e.target.value)
        }}
      />
      <i
        onClick={() => {
          if (!ref_is_blur.current) {
            search()
          }
        }}
        className={'iconfont icon-sousuo ' + styles.icon}
      />
    </FilterItem>
  )
}

export default Component
