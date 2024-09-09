/**
 * 页面接口
 */
import $axios from '@/service/httpServer'

// 获取页面表格数据
export const apiGetTableData = p => $axios.get('/api/org/listBy', p)
export const apiDeleteOrganization = p => $axios.delete('/api/org/del', p)
export const apiEditOrganization = p => $axios.post('/api/org/update', p)
export const apiAddOrganization = p => $axios.post('/api/org/create', p)
export const apiOrganizationUpdateState = p => $axios.post('/api/org/state', p)
export const apiOrganizationUpAndDown = p => $axios.post('/api/org/upAndDown', p)
