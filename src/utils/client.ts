export function isWin() {
  return window.navigator.platform === 'Win32' || window.navigator.platform === 'Windows'
}
export function isMac() {
  return (
    window.navigator.platform === 'Mac68K' ||
    window.navigator.platform === 'MacPPC' ||
    window.navigator.platform === 'Macintosh' ||
    window.navigator.platform === 'MacIntel'
  )
}
export const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(typeof navigator !== 'undefined' ? navigator?.platform : '')
export function getOS() {
  if (isMac()) return 'Mac'
  if (isWin()) return 'Windows'
  return ''
}
export default { OS: getOS() }

/**
 * 获取当前浏览器信息
 * @returns {object} 包含浏览器名称和版本号的对象.
 */
export function getBrowserInfo() {
  const userAgent = navigator.userAgent.toLowerCase()

  // 检查userAgent以确定浏览器类型
  const isIE = userAgent.includes('msie') || userAgent.includes('trident')
  const isEdge = userAgent.includes('edg/')
  const isFirefox = userAgent.includes('firefox/')
  const isChrome = userAgent.includes('chrome/')
  const isSafari = userAgent.includes('safari/') && !isChrome

  // 从userAgent中提取版本号
  const version =
    (isIE && userAgent.match(/(msie|rv:)\s?([\d.]+)/)?.[2]) ||
    (isEdge && userAgent.match(/edg\/([\d.]+)/)?.[1]) ||
    (isFirefox && userAgent.match(/firefox\/([\d.]+)/)?.[1]) ||
    (isChrome && userAgent.match(/chrome\/([\d.]+)/)?.[1]) ||
    (isSafari && userAgent.match(/version\/([\d.]+)/)?.[1]) ||
    ''

  // 根据浏览器类型返回名称
  const name =
    (isIE && 'ie') || (isEdge && 'Edge') || (isFirefox && 'Firefox') || (isChrome && 'Chrome') || (isSafari && 'Safari') || ''

  // 返回包含浏览器名称和版本号的对象
  return {
    name,
    version
  }
}
/**
 * 当前平台是否可以使用pdf.js插件预览pdf
 * @returns
 */
export function assertcanUsePdfjs() {
  let isOk = true
  const browserInfo = getBrowserInfo()
  if (browserInfo.name === 'Chrome' && parseInt(browserInfo.version) < 92) {
    isOk = false
  }
  return isOk
}
