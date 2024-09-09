/**
 * 页面接口
 */
import $axios from '@/service/httpServer'
import store from '@/store'
const getDBID = () => store.getState().app.systemInitData.DBID || window['SYSTEM']?.DBID
// 打印接口地址
export const printUrl = `/k-fi-rpt/${getDBID()}/v1/invoice/print`
// 导出接口地址
export const exportUrl = `/k-fi-rpt/${getDBID()}/v1/invoice/export`
// 获取页面表格数据
export const apiGetTableData = p => $axios.get('/mock/379/k-front-mock/table1', p)
