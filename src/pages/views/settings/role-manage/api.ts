/**
 * 页面接口
 */
import $axios from '@/service/httpServer'

// 获取页面表格数据
export const apiGetTableData = p => $axios.get('/api/role/list', p)
export const apiDeleteRole = p => $axios.post('/api/role/del', p)
export const apiEditRole = p => $axios.post('/api/role/update', p)
export const apiAddRole = p => $axios.post('/api/role/create', p)
export const apiRoleGrant = p => $axios.post('/api/role/grant', p)
export const apiRoleGrantList = p => $axios.get('/api/role/grant/list', p)
export const apiRoleUpdateState = p => $axios.get('/api/role/grant/list', p)
