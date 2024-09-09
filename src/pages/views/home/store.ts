import { AppThunk } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiGetTableData } from './api'
import { IFilterParams, ITableParams, PAGE_NAME } from './const'

export interface IState {
  pageName: string
  loading: boolean
}

const initialState: IState = {
  pageName: PAGE_NAME,
  loading: false
}

export const slice = createSlice({
  name: PAGE_NAME,
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})

// 获取表单数据
export const getPageData =
  (params?: object): AppThunk =>
  (dispatch, getState) => {
    const state = getState()[PAGE_NAME]
    dispatch(setLoading(true))
    // do some things
  }

export const { setLoading } = slice.actions

const exp = {
  sliceName: PAGE_NAME,
  reducer: slice.reducer,
  ...slice.actions
}
export default exp

export type SliceType = typeof exp
