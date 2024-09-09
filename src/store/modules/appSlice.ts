import { createSlice } from '@reduxjs/toolkit'
import defaultSystemModel from '@/model/default-system-model'
import { getBaseData } from '@/api/common'
export interface AppState {
  access_token: string
  // 系统参数
  systemInitData: any
  // 权限码
  permissions: string[] | number[]
  // 顶部导航收起/展开
  hideHeader: boolean
}

const initialState: AppState = {
  access_token: '',
  systemInitData: defaultSystemModel,
  permissions: [],
  hideHeader: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSystemInitData(state, action) {
      state.systemInitData = action.payload
      // 从系统参数中拿权限码
      state.permissions = action.payload.rights || []
    },
    updateSystemInitDataAttr(state, action) {
      const newData = {
        ...state.systemInitData,
        ...(action.payload || {})
      }
      state.systemInitData = {
        ...newData
      }
    },
    switchHideHeader(state) {
      state.hideHeader = !state.hideHeader
    },
    setAccessToken(state, action) {
      state.access_token = action.payload.access_token
    },
    
  }
})

/**
 * 获取系统参数数据
 * @returns 返回个Promise
 */
export function getSystemInitDataAsync() {
  return async function (dispatch) {
    const res: any = await getBaseData()
    if (!res) {
      return null
    }
    const systemInitData: any = res || {}
    dispatch(setSystemInitData({ ...systemInitData }))
    return systemInitData
  }
}

export const { setSystemInitData, updateSystemInitDataAttr, switchHideHeader, setAccessToken } = appSlice.actions

export default appSlice.reducer
