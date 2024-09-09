import { configureStore, ThunkAction, combineReducers, Action, Reducer } from '@reduxjs/toolkit'
import * as config from '@/config'
import { getReducerManager } from './reducerManager'
// 模块
import appSlice from './modules/appSlice'
import tabSlice from './modules/tabSlice'
import localCacheSlice from './modules/localCacheSlice'
import baseDataSlice from './modules/baseDataSlice'

const reducerManager = getReducerManager({
  app: appSlice,
  tab: tabSlice,
  localCache: localCacheSlice,
  baseData: baseDataSlice
})
export const store = configureStore({
  reducer: reducerManager.reduce,
  devTools: config.debuggerMode,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
})

export const { add, remove } = reducerManager
export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
