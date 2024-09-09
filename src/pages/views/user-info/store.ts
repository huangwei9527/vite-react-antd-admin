import { AppThunk } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiGetUserInfoDetail } from './api'
import { PAGE_NAME } from './const'

export interface IState {
  pageName: string
  loading: boolean
  userInfo: any
}

const initialState: IState = {
  pageName: PAGE_NAME,
  loading: false,
  userInfo: {}
}

export const slice = createSlice({
  name: PAGE_NAME,
  initialState,
  reducers: {
    // loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    // 更新个人信息详情
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = { ...state.userInfo, ...action.payload }
    }
  }
})

// 获取表单数据
export const getPageData = (): AppThunk => (dispatch, getState) => {
  dispatch(setLoading(true))
  apiGetUserInfoDetail({})
    .then((res: any) => {
      if (!res.data) {
        dispatch(setLoading(false))
        return
      }
      dispatch(setUserInfo(res?.data || {}))
    })
    .finally(() => {
      dispatch(setLoading(false))
    })
}

export const { setLoading, setUserInfo } = slice.actions

const exp = {
  sliceName: PAGE_NAME,
  reducer: slice.reducer,
  ...slice.actions
}
export default exp

export type SliceType = typeof exp
