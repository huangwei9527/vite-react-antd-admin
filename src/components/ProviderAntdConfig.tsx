import { useAppSelector } from '@/store/redux-hooks'
import { ConfigProvider, message, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
export default Component => (props: any) => {
  const [api, contextHolder] = message.useMessage()
  const { themeMode, themeColor } = useAppSelector(s => s.localCache)
  const theme = {
    token: {
      colorPrimary: themeColor
    }
  }
  return (
    <ConfigProvider theme={theme} locale={zhCN}>
      {contextHolder}
      <Component {...props} />
    </ConfigProvider>
  )
}
