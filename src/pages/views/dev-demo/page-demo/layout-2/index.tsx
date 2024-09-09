import React, { FC, useEffect, useState } from 'react'
import TabLayout from '@/components/TabLayout'
import { Button, message, Space, Spin } from 'antd'

const DemoPage = (props: any) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      message.success(props.number + ' 接口请求完成')
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="app-page1">
      {loading && (
        <div className="custom-page-table-loading-wrapper">
          <Spin />
        </div>
      )}
      <div className="vertical-center fontsize-22 marginT10 bg-silver">{props.number}</div>
    </div>
  )
}

const Component: FC = () => {
  const [value, setValue] = useState('2')
  useEffect(() => {}, [])

  const handleTabsChange = val => {
    setValue(val)
    console.log('TabLayout.Tabs: ', val)
  }

  return (
    <div className="app-page1">
      <TabLayout.Tabs value={value} onChange={val => handleTabsChange(val)}>
        <TabLayout.TabsItem label="页签1" value="1">
          <DemoPage number="page 1" />
        </TabLayout.TabsItem>
        <TabLayout.TabsItem label="页签2" value="2">
          <DemoPage number="page 2" />
        </TabLayout.TabsItem>
        <TabLayout.TabsItem label="页签3" value="3">
          <DemoPage number="page 3" />
        </TabLayout.TabsItem>
        <TabLayout.TabsItem label="页签4" value="4">
          <DemoPage number="page 4" />
        </TabLayout.TabsItem>
      </TabLayout.Tabs>
    </div>
  )
}

export default Component
