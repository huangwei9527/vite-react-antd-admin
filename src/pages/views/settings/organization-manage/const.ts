/**
 * 页面常量
 */

// 页面name 通过分类名module和page name生成
export const PAGE_NAME = 'organizationManage'
export const PAGE_NAME_CN = '组织机构'
// 页面tag
export const PAGE_TAG = { name: PAGE_NAME, version: '0.0.1' }
// page权限码 permission code
export const pagePMC = {
  CHECK: '', // 查看
  EDIT: '', // 编辑
  DELETE: '', // 删除
  ADD: '', // 新增
  PRINT: '', // 打印
  EXPORT: '', // 导出
  IMPORT: '' // 导入
}

export interface IFilterParams {
  [key: string]: any
}

export interface ITableParams {
  loading: boolean
  data: any[]
  records?: number // 总条数
  [key: string]: any
}
