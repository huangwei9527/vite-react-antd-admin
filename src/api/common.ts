import store from '@/store'
import $axios from '@/service/httpServer'
const getDBID = () => store.getState().app.systemInitData.DBID
import { DialogBase } from '@/components/dialogs/dialog-info/index'
import awaitWrapper from '@/utils/awaitWrapper'

/**
 * @returns 获基础取数据
 *
 */
export async function getBaseData() {
  let [err, res] = await awaitWrapper($axios.get('/basedata/initParams?m=getSystemParams'))
  if (err) {
    DialogBase({
      type: 'error',
      title: '系统提示',
      width: 320,
      noCancelBtn: true,
      closable: false,
      body: '获取账套信息失败，请重试！'
    })
    return null
  }
  return res
}
