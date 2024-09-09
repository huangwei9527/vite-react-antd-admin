/**
 * 路由
 */
import { IRoute } from './types'

// 页面
import Home from '@/pages/views/home'
import NoFund from '@/pages/404'

// 子模块
import devDemo from './modules/dev-demo'
import settings from './modules/settings'
import { lazy } from 'react'

const NoFundRoute = {
  path: '/404',
  name: '404',
  component: NoFund
}

const routes: IRoute[] = [
  {
    path: '/',
    name: '首页',
    component: Home,
    meta: {
      noPadding: true,
      className: 'no-padding'
    }
  },
  {
    path: '/user-info',
    name: '个人信息',
    component: lazy(() => import('@/pages/views/user-info'))
  },
  NoFundRoute,
  ...devDemo,
  ...settings
]

export default routes

export const flattenRoutes = (arr: any[]) =>
  arr.reduce((prev: any[], item: any) => {
    if (Array.isArray(item.children)) {
      prev.push(item)
    }
    return prev.concat(Array.isArray(item.children) ? flattenRoutes(item.children) : item)
  }, [])
/**
 * 根据path获取当前路由配置
 * @param path
 * @returns
 */
export const getRouteByPath = (path: string): IRoute | null => {
  const truePath = path.split('?')[0]
  const curRoute = flattenRoutes(routes).find((item: { path: string }) => item.path === truePath)
  return curRoute || NoFundRoute
}
