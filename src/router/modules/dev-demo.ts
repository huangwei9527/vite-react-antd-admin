import { lazy } from 'react'
export default [
  // 页面路由
  {
    path: '/dev-demo/index',
    name: '开发模版',
    component: lazy(() => import('@/pages/views/dev-demo/index'))
  }
]
