import { AppThunk } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { apiGetTableData, apiGetTreeData } from './api'
import { IFilterParams, ITableParams, PAGE_NAME } from './const'
import { handleTransformTree } from './helps'
export interface IState {
  pageName: string
  filterParams: IFilterParams
  tableParams: ITableParams
  treeData: any[] // 树结构
  siderPlacement: 'left' | 'right' // 左右分割的容器位置
}

export const defaultFilterParams: IFilterParams = {
  page: 1,
  pageSize: 100,
  fromPeriod: '',
  toPeriod: '',
  value1: false,
  value2: '',
  value3: '',
  value4: '',
  value5: false,
  treeSelectId: ''
}

const initialState: IState = {
  pageName: PAGE_NAME,
  filterParams: defaultFilterParams,
  tableParams: {
    loading: false,
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
      }
    ]
  },
  treeData: [],
  siderPlacement: 'left'
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
    },
    // 更新树数据
    setTreeData: (state, action: PayloadAction<any>) => {
      state.treeData = action.payload
    },
    // 修改左右分割布局位置
    setSiderPlacement: (state, action: PayloadAction<'left' | 'right'>) => {
      state.siderPlacement = action.payload
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
// 获取树结构数据
export const getTreeData =
  (params?: object): AppThunk =>
  (dispatch, getState) => {
    const state = getState()[PAGE_NAME]
    dispatch(setTableLoading(true))
    let _params = { ...state.filterParams, ...params }
    dispatch(setFilterParams(_params))
    apiGetTreeData(_params)
      .then((res: any) => {
        if (!res.data) {
          dispatch(setTableLoading(false))
          return
        }
        let rows = [{ id: '0', name: '全部', children: [...(res?.data?.rows || [])] }]
        handleTransformTree(rows)
        dispatch(setTreeData(rows))
      })
      .finally(() => {
        dispatch(setTableLoading(false))
      })
  }
export const { setTableLoading, setFilterParams, setTableData, setTreeData } = slice.actions

const exp = {
  sliceName: PAGE_NAME,
  reducer: slice.reducer,
  ...slice.actions
}
export default exp

export type SliceType = typeof exp
