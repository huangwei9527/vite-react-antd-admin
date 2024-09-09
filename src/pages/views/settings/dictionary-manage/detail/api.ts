/**
 * 页面接口
 */
import $axios from '@/service/httpServer'

// 获取页面表格数据
export const apiGetTableData = p =>
  $axios.get('https://apifoxmock.com/m1/3107737-991614-default/common/tree?apifoxToken=4tvTc09NmVjFgLiMQFJBg', p)
export const apiDeleteDictionary = p =>
  $axios.post('https://apifoxmock.com/m1/3107737-991614-default/common/post?apifoxToken=4tvTc09NmVjFgLiMQFJBg', p)
export const apiEditDictionary = p =>
  $axios.post('https://apifoxmock.com/m1/3107737-991614-default/common/post?apifoxToken=4tvTc09NmVjFgLiMQFJBg', p)
