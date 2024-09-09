import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export interface IRootState extends RootState {
  [key: string]: any
}
export interface IAppDispatch extends AppDispatch {
  [key: string]: any
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<IAppDispatch>()
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
