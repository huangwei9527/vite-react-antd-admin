/**
 *  存储公共的数据：
 */

import store, { AppThunk } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 唯一name字段
const SLICENAME = 'baseData'

interface IState {}

const initialState: IState = {}

export const baseDataSlice = createSlice({
  name: SLICENAME,
  initialState,
  reducers: {}
})

export const {} = baseDataSlice.actions

export default baseDataSlice.reducer
