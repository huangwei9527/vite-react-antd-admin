import React, { Children, FC, FunctionComponentElement, cloneElement, useState, useEffect, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './index.module.less'
import { Radio } from 'antd'

interface ITabProps {
  value: string
  onChange?: (v: string) => void
  children: ReactNode
  tabExtend?: ReactNode // 页签扩展部分，用于部分设计页签旁边还有其他操作按钮或者描述信息
  className?: string
}

const Tabs = (props: ITabProps) => {
  const { value, onChange, children } = props
  const [activeValue, setActiveValue] = useState<string>(value)

  useEffect(() => {
    setActiveValue(value)
  }, [value])

  const handleClick = val => {
    setActiveValue(val)
    onChange && onChange(val)
  }

  const renderTabItemLabel = () => {
    let tabList = []
    Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<any>
      tabList.push({ label: childElement.props.label, value: childElement.props.value })
    })
    return (
      <div>
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={activeValue}
          onChange={e => {
            handleClick(e.target.value.toString())
          }}
        >
          {(tabList || []).map(v => {
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

  const renderTabItemContent = () => {
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<any>
      if (childElement.type.displayName === 'TabsItem') {
        return cloneElement(childElement, {
          isActive: activeValue === childElement.props.value
        })
      }
    })
  }
  return (
    <div className={classNames('app-page1 tab-layout-wrapper', props.className || '')}>
      <div className="app-page1-filter tab-layout-filter">
        {renderTabItemLabel()}
        {props.tabExtend ? props.tabExtend : null}
      </div>
      <div className="app-page1-table tab-layout-table">
        <div className={styles.tabsLayoutWrapper}>{renderTabItemContent()}</div>
      </div>
    </div>
  )
}

export default Tabs
