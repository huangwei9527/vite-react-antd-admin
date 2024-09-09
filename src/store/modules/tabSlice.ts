// counterSlice.ts 文件

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import $eventBus, { EVENT_LEAVE_TAB_ROUTE } from '@/event-bus'

export interface ITabItem {
  id: string
  rootId?: string // 跟节点id
  title: string
  path: string
  isIframe?: boolean // 是否是iframe嵌套
  isPermanent?: true // 是否常驻 首页常驻
  timer?: number // 用于记录tab被添加的时间顺序
  params?: any // 路由参数
  notRefresh?: boolean //不需要刷新
  beforClose?: (closeFn?: () => void) => boolean
  [key: string]: any
}
export interface ITabState {
  activeTab: string
  tabList: ITabItem[]
  reloadPath: string
}

export const defaultHomeTab: ITabItem = {
  id: 'home',
  title: '首页',
  path: '/'
}

const initialState: ITabState = {
  activeTab: defaultHomeTab.path,
  tabList: [defaultHomeTab],
  reloadPath: ''
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  // 定义 reducers 并生成关联的操作
  reducers: {
    setTabs: (state, action: PayloadAction<ITabItem[]>) => {
      state.tabList = action.payload
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      $eventBus.emit(EVENT_LEAVE_TAB_ROUTE, state.activeTab || defaultHomeTab.path)
      state.activeTab = action.payload || defaultHomeTab.path
    },
    setReloadPath: (state, action) => {
      state.reloadPath = action.payload
    }
  }
})

export const { setTabs, setActiveTab, setReloadPath } = tabSlice.actions

export const selectTabList = (state: RootState) => state.tab.tabList
export const selectActiveTab = (state: RootState) => state.tab.activeTab

// 默认导出
export default tabSlice.reducer
