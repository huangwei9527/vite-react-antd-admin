import React, { FC } from 'react'
import './index.less'
const Layout: FC = () => {
  return (
    <div className="page-layout-wrapper">
      <div className="page-layout-wrapper">
        <div className="top_404">
          <div>404</div>
          <div>SORRY您访问的页面弄丢了</div>
        </div>
        <div className="main_content_404">
          <div className="content_left_404">
            <div className="title_404">可能原因:</div>
            <ul className="reasonBox">
              <li>1. 网络信号差</li>
              <li>2. 找不到请求的页面</li>
              <li>3. 输入的网址不正确</li>
            </ul>
          </div>
          <div className="content_right_404">
            <div className="title_404">可以尝试:</div>
            <span className="returnIndex_page">返回首页</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
