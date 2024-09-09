import store from '@/store'
import $axios from '@/service/httpServer'
const getDBID = () => store.getState().app.systemInitData.DBID
// 获取凭证字
export const apiGetGenerateCode = p => $axios.get('/gl/generatecode?m=findAll', p)
// 获取币别
export const getCurrency = p => $axios.get(`/k-fi/${getDBID()}/bs/v1/currency`, p)
// 获取出纳账户列表
export const apiGetCashierAccountList = p => $axios.get(`/k-fi/${getDBID()}/ca/v1/cashier-account`, p)
