import { AppThunk } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiGetTableData } from './api'
import { IFilterParams, ITableParams, PAGE_NAME } from './const'

export interface IState {
  pageName: string
  filterParams: IFilterParams
  tableParams: ITableParams
}

export const defaultFilterParams: IFilterParams = {
  page: 1,
  pageSize: 100,
  value3: ''
}

const initialState: IState = {
  pageName: PAGE_NAME,
  filterParams: defaultFilterParams,
  tableParams: {
    loading: true,
    total: 0,
    data: [
      {
        number: 1,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '26,800.00'
      },
      {
        number: 2,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 3,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '246,800.00'
      },
      {
        number: 4,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '216,800.00'
      },
      {
        number: 5,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 2,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 3,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '246,800.00'
      },
      {
        number: 4,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '216,800.00'
      },
      {
        number: 5,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 2,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 3,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '246,800.00'
      },
      {
        number: 4,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '216,800.00'
      },
      {
        number: 5,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 2,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 3,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '246,800.00'
      },
      {
        number: 4,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '216,800.00'
      },
      {
        number: 5,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 2,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      },
      {
        number: 3,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '246,800.00'
      },
      {
        number: 4,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '216,800.00'
      },
      {
        number: 5,
        name: '陕西环宇科技',
        remark: '深圳环球科技',
        amount: '236,800.00'
      }
    ]
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
