/**
 * 页面接口
 */
import $axios from '@/service/httpServer'
import store from '@/store'
const getDBID = () => store.getState().app.systemInitData.DBID || window['SYSTEM']?.DBID

// 获取页面表格数据
export const apiGetTableData = p =>
  $axios.get('https://apifoxmock.com/m1/3107737-991614-default/common/table?apifoxToken=4tvTc09NmVjFgLiMQFJBg', p)
