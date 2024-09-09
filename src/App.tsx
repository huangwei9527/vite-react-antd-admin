import React, { FC, useEffect, useLayoutEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import '@/assets/iconfont/iconfont.css'
import '@/styles/common.less'
import Layout from './pages/layout'
import Login from './pages/login'
import ProviderAntdConfig from './components/ProviderAntdConfig'
import { useAppDispatch, useAppSelector } from './store/redux-hooks'
import { fetchCacheFromeLocalstorage } from './store/modules/localCacheSlice'

const App: FC = () => {
  const dispatch = useAppDispatch()
  const { themeMode, themeColor } = useAppSelector(s => s.localCache)
  useLayoutEffect(() => {
    // 从本地同步已缓存的数据
    dispatch(fetchCacheFromeLocalstorage())
  }, [])
  useEffect(() => {
    document.body.setAttribute('data-theme', themeColor)
  }, [themeColor])
  useEffect(() => {
    document.body.classList.toggle('isDark', themeMode === 'dark')
  }, [themeMode])
  return (
    <div className="page-container-wrapper" id="pageContainerWrapper">
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </HashRouter>
    </div>
  )
}
export default ProviderAntdConfig(App)
