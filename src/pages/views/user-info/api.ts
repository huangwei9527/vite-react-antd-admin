/**
 * 页面接口
 */
import $axios from '@/service/httpServer'
import store from '@/store'
const getDBID = () => store.getState().app.systemInitData.DBID || window['SYSTEM']?.DBID

// 获取个人详情
export const apiGetUserInfoDetail = p => $axios.get('/mock/379/k-front-mock/table1', p)
