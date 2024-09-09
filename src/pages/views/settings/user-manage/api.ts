/**
 * 页面接口
 */
import $axios from '@/service/httpServer'

// 获取页面表格数据
export const apiGetTableData = p => $axios.get('/api/account/list', p)
export const apiDeleteAccount = p => $axios.post('/api/account/del', p)
export const apiEditAccount = p => $axios.post('/api/account/update', p)
export const apiAddAccount = p => $axios.post('/api/account/create', p)
export const apiAccountUpdateState = p => $axios.post('/api/account/disable', p)
export const apiAccountResetPass = p => $axios.post('/api/account/initPwd', p)
export const apiAccountcheck = p => $axios.get('/api/account/check', p)
