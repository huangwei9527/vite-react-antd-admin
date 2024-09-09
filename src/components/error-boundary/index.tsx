import { Button, Empty, Spin } from 'antd'
import React, { PureComponent } from 'react'
interface IProps {
  children: React.ReactNode
}
interface IState {
  hasError: boolean
  refreshing: boolean
}
export default class ErrorBound extends PureComponent<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      refreshing: false
    }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 1、错误信息（error）
    // 2、错误堆栈（errorInfo)
    console.log(error, errorInfo)
  }

  handleRefresh() {
    this.setState({ refreshing: true }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false })
      })
    })
  }

  render() {
    if (this.state.refreshing) {
      return (
        <div className="vertical-center">
          <Spin tip="Loading" />
        </div>
      )
    }
    if (this.state.hasError) {
      return (
        <div className="vertical-center">
          <Empty
            description={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                加载失败啦，请按键盘F5刷新界面，或
                <Button
                  style={{ fontSize: '14px' }}
                  type="text"
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  点击刷新
                </Button>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )
    }
    return <>{this.props.children}</>
  }
}
