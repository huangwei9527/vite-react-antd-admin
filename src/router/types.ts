import { ReactNode } from 'react'

export interface IRoute {
  path: string
  name: string
  component: any
  children?: IRoute[] | undefined
  permissionCode?: string[] | string // 权限码
  [key: string]: any
}
