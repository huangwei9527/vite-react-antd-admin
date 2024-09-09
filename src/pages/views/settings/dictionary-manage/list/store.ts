import { AppThunk } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiGetTableData } from './api'
import { IFilterParams, ITableParams, PAGE_NAME } from './const'
import dayjs from 'dayjs'

export interface IState {
  pageName: string
  filterParams: IFilterParams
  tableParams: ITableParams
}

export const defaultFilterParams: IFilterParams = {
  page: 1,
  pageSize: 100,
  keywords: '',
  state: ''
}

const initialState: IState = {
  pageName: PAGE_NAME,
  filterParams: defaultFilterParams,
  tableParams: {
    loading: true,
    total: 0,
    data: []
  }
}

export const slice = createSlice({
  name: PAGE_NAME,
  initialState,
  reducers: {
    // 表格loading
    setTableLoading: (state, action: PayloadAction<boolean>) => {
      state.tableParams.loading = action.payload
    },
    // 更新搜索条件
    setFilterParams: (state, action: PayloadAction<any>) => {
      state.filterParams = { ...state.filterParams, ...action.payload }
    },
    // 更新表格数据
    setTableData: (state, action: PayloadAction<any>) => {
      state.tableParams = { ...state.tableParams, ...action.payload }
    }
  }
})

// 获取表单数据
export const getTableData =
  (params?: object): AppThunk =>
  (dispatch, getState) => {
    const state = getState()[PAGE_NAME]
    dispatch(setTableLoading(true))
    let _params = { ...state.filterParams, ...params }
    dispatch(setFilterParams(_params))
    apiGetTableData(_params)
      .then((res: any) => {
        if (!res.data) {
          dispatch(setTableLoading(false))
          return
        }
        dispatch(
          setTableData({
            loading: true,
            total: res?.data?.total || 0,
            data: res?.data?.rows || []
          })
        )
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }

export const { setTableLoading, setFilterParams, setTableData } = slice.actions

const exp = {
  sliceName: PAGE_NAME,
  reducer: slice.reducer,
  ...slice.actions
}
export default exp

export type SliceType = typeof exp
