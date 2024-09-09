import { createSlice } from '@reduxjs/toolkit'

export interface IUserState {
  hideSensitiveInformation: boolean // 是否隐藏敏感数据信息
  sidebarCollapsed: boolean
  sidebarTheme: string // dark light followTheme
  themeMode: 'dark' | 'light'
  themeColor: string
  showSidebarLogo: boolean
  showTabRoute: boolean // 是否显示页签
  showPageHeader: boolean
  isPageBorderRadius: boolean
  [key: string]: any
}
const initialState: IUserState = {
  hideSensitiveInformation: false,
  sidebarCollapsed: false,
  sidebarTheme: 'dark',
  themeMode: 'light',
  themeColor: '#2f95ff',
  showSidebarLogo: true,
  showTabRoute: true,
  showPageHeader: true,
  isPageBorderRadius: true
}

export const localCacheSlice = createSlice({
  name: 'localCache',
  initialState,
  // 定义 reducers 并生成关联的操作
  reducers: {
    fetchCacheFromeLocalstorage(state) {
      let cacheData: string | any = window.localStorage.getItem('APP_STORE_LOCAL_CACHE') || '{}'
      try {
        cacheData = JSON.parse(cacheData)
      } catch (e) {
        cacheData = {}
      }
      Object.keys(cacheData).forEach(key => {
        state[key] = cacheData[key]
      })
    },

    /**
     * 更新字段key value
     * @param state
     * @param action
     * @constructor
     */
    updateLocalstorageCache(state, action) {
      const opt = action.payload
      if (!opt) {
        return
      }
      Object.keys(opt).forEach(key => {
        state[key] = opt[key]
      })
      // 构造缓存数据
      let localStorageCacheData: string | any = window.localStorage.getItem('APP_STORE_LOCAL_CACHE') || '{}'
      try {
        localStorageCacheData = JSON.parse(localStorageCacheData)
      } catch (e) {
        localStorageCacheData = {}
      }
      const cacheData = { ...localStorageCacheData }
      for (let key in state) {
        cacheData[key] = state[key]
      }
      window.localStorage.setItem('APP_STORE_LOCAL_CACHE', JSON.stringify(cacheData))
    }
  }
})
export const { fetchCacheFromeLocalstorage, updateLocalstorageCache } = localCacheSlice.actions

// 默认导出
export default localCacheSlice.reducer
