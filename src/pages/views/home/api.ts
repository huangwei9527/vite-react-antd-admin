/**
 * 页面接口
 */
import $axios from '@/service/httpServer'
import store from '@/store'
const getDBID = () => store.getState().app.systemInitData.DBID

// 获取页面表格数据
export const apiGetTableData = p => $axios.get('/mock/379/k-front-mock/table1', p)

