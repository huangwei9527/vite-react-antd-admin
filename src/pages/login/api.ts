/**
 * 页面接口
 */
import $axios from '@/service/httpServer'

export const apiGetValidatecode = p => $axios.post('https://apifoxmock.com/m1/4899288-4555712-default/api/sendvalidatecode', p)
export const apiDoLogin = p => $axios.post('https://apifoxmock.com/m1/4899288-4555712-default/login', p)