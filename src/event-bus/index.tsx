import mitt from 'mitt'
const emitter = mitt()
emitter['once'] = (type, handler) => {
  const fn = arg => {
    emitter.off(type, fn)
    handler(arg)
  }

  emitter.on(type, fn)

  // add a property to the handler
  handler._ = fn

  // or

  // return this handler
  return fn
}
export default emitter

// 系统已加载完毕
export const EVENT_SYSTEM_READY = 'system_ready'
export const EVENT_MULT_ACCT_READY = 'mult_acct_ready'
// 侧边栏导航点击
export const EVENT_SIDEBAR_MENU_CLICK = 'sidebar_menu_click'
export const EVENT_SIDEBAR_MENU_CLICK_BY_NAME = 'sidebar_menu_click_by_name'
export const EVENT_SIDEBAR_MENU_SET_NEW = 'sidebar_menu_set_new'
export const EVENT_SIDEBAR_MENU_REMOVE_NEW = 'sidebar_menu_REMOVE_new'
export const EVENT_SIDEBAR_MENU_CONFIG = 'sidebar_menu_config'
// 页面resize
export const EVENT_PAGE_RESIZE = 'page_resize'

// 顶部消息提示相关事件  show remove
export const EVENT_PAGE_TOP_ALERT_MESSAGE_SHOW = 'page_top_alert_show'
export const EVENT_PAGE_TOP_ALERT_MESSAGE_REMOVE = 'page_top_alert_REMOVE'

// tab 页签
export const EVENT_ENTER_TAB_ROUTE = 'enter_tab_route'
export const EVENT_LEAVE_TAB_ROUTE = 'leave_tab_route'
export const EVENT_DELETEE_KEEPALIVE = 'delete_keep_alive' // 删除keepAlive缓存
export const EVENT_REFRESH_CURRENT_PAGE = 'refresh_current_page' // 刷新页面
export const EVENT_REFRESH_CURRENT_PAGE_IFREAME = 'refresh_current_page_iframe' // 刷新页面
