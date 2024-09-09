import { lazy } from 'react'
export default [
  {
    path: '/setting/system-params',
    name: '系统参数',
    component: lazy(() => import('@/pages/views/settings/system-params'))
  },
  {
    path: '/setting/dictionary',
    name: '字典管理',
    component: lazy(() => import('@/pages/views/settings/dictionary-manage/list'))
  },
  {
    path: '/setting/dictionary/detail',
    name: '字典项',
    component: lazy(() => import('@/pages/views/settings/dictionary-manage/detail'))
  },
  {
    path: '/setting/org-manage',
    name: '组织机构',
    component: lazy(() => import('@/pages/views/settings/organization-manage'))
  },
  {
    path: '/setting/role-manage',
    name: '角色管理',
    component: lazy(() => import('@/pages/views/settings/role-manage'))
  },
  {
    path: '/setting/user-manage',
    name: '用户管理',
    component: lazy(() => import('@/pages/views/settings/user-manage'))
  },
  {
    path: '/setting/login-log',
    name: '登录日志',
    component: lazy(() => import('@/pages/views/settings/login-log'))
  },
  {
    path: '/setting/operation-log',
    name: '操作日志',
    component: lazy(() => import('@/pages/views/settings/operation-log'))
  }
]
