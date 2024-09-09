import React, { FC, useEffect, useState } from 'react'
import SplitPanelLayout from '@/components/SplitPanelLayout'
import { Button, Space } from 'antd'

const Component: FC = () => {
  const [value, setValue] = useState(false)
  useEffect(() => {}, [])

  return (
    <div className="app-page1">
      <div className="app-page1-filter ">
        <div className="app-page1-filter-container">
          <Space>
            <Button type="primary" onClick={() => setValue(!value)}>
              切换左右布局
            </Button>
            <span className="gray">可以支持记住用户拖动的宽度</span>
          </Space>
        </div>
      </div>
      <div className="app-page1-table">
        <SplitPanelLayout pageId="page-demo-layout-1" siderPlacement={value ? 'right' : 'left'} sider={<div>树结构</div>}>
          <div className="bg-silver">表格区域</div>
        </SplitPanelLayout>
      </div>
    </div>
  )
}

export default Component
