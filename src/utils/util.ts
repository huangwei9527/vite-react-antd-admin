import dayjs from 'dayjs'
import { cloneDeep, isEqual } from 'lodash'

export const isBool = val => typeof val === 'boolean'
export const isObject = (value: unknown): value is Record<any, any> => value !== null && typeof value === 'object'
export const isFunction = (value: unknown): value is Function => typeof value === 'function'
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isUndef = (value: unknown): value is undefined => typeof value === 'undefined'
export const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement)
export function isAsyncFunction(func) {
  return func[Symbol.toStringTag] === 'AsyncFunction'
}
/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse(url) {
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}

/**
 * 获取url参数
 * @param url
 * @param name
 * @returns {*}
 */
export function getUrlParams(url, name) {
  const params = urlParse(url)
  return params[name]
}

/**
 * @description: 解析地址栏入参
 * @param {String} key  //参数key
 * @returns {String}
 */
export function getQueryString(key) {
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 多维数组扁平化
 * @param arr
 * @returns {*}
 */
export function arrFlatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? arrFlatten(item) : item)
  }, [])
}

/**
 * 数组对象中通过键值查找
 * @param arr
 * @param key
 * @param matchV
 * @returns {null|*}
 */
export function queryFromArrayObj(arr, key, matchV) {
  if (!arr || arr.length === 0 || key === '') {
    return null
  }
  for (let i = 0, l = arr.length; i < l; i++) {
    if (arr[i][key] === matchV) {
      return arr[i]
    }
  }
  return null
}

/**
 * 根据value查找对于的label值
 * @param arr
 * @param value
 * @returns {*}
 */
export function getLabelFromArrObj(arr, value) {
  const data = arr.find(v => v.value === value)
  return data ? data.label : value
}

/**
 * 数组转tree
 * @param list
 * @param parentIdKey
 * @returns {*[]}
 */
export function composeTree(list = [], parentIdKey = 'pid') {
  const data = [...list]
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children
  })
  const map = {}
  data.forEach(item => {
    map[item.id] = item
  })
  data.forEach(item => {
    const parent = map[item[parentIdKey]]
    if (parent) {
      ;(parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * 是否为空
 * @param v
 * @returns {boolean}
 */
export function numIsEmpty(v) {
  if (v === '0' || v === '' || v === undefined) {
    return true
  }
  return false
}

/**
 * 文本裁剪，max代表最大长度, textEllipsis('abc', 1) 返回 'a...'
 * @param max
 * @returns {string}
 */
export function textEllipsis(str, max) {
  if (!str) return ''
  if (str.length <= max) return str
  return str.substring(0, max) + '...'
}

/**
 * 判断是否是有效的json 字符串
 * @param str
 * @returns {boolean}
 */
export function isJsonString(str) {
  if (typeof str !== 'string') return false
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
/**
 * 数字格式化
 * @param s 需要格式化数字
 * @param n 取小数点后位数
 * @type int
 * @returns 字符在数组中的位置，没找到返回'--'
 */
export const formatMoney = (s, n?: number) => {
  let flag = '0'
  if (!s || s === '') {
    return '0.00'
  }
  s = s.toString()
  //记录负号标志
  if (s.substring(0, 1) === '-') {
    s = s.substring(1, s.length)
    flag = '1'
  }

  n = n >= 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\\.-]/g, '')).toFixed(n) + ''
  let l = s.split('.')[0].split('').reverse(),
    r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
  }

  let result = t.split('').reverse().join('')
  if (n > 0) {
    result += '.' + r
  }
  if (flag === '1') result = '-' + result
  let re = /^(\\-)?0.0+$/
  if (re.test(result)) {
    result = '0.00'
  }
  return result
}

/**
 * 生成期间列表数据
 * 从2017到至今的期间数
 */
export function createPeriodList() {
  const date = new Date()
  const currentY = date.getFullYear()
  const currentM = date.getMonth() + 1
  const list = []
  const startY = 2000
  for (let y = startY; y <= currentY; y++) {
    let maxM = y === currentY ? currentM : 12
    for (let m = 1; m <= maxM; m++) {
      if (y === 2000 && m === 1) {
        continue
      }
      list.push({
        label: `${y}年${m}期`,
        value: Number(y.toString() + (m > 9 ? m : '0' + m).toString())
      })
    }
  }
  return list.reverse()
}
/**
 * 全局引用计数
 *
 */
const refCount = () => {
  let count = 0
  // eslint-disable-next-line no-plusplus
  return (pre: string) => `${pre}_${count++}`
}
export const getRefCount = refCount()

/**
 * 递归模式，数组转tree
 * @param arr 目标数组
 * @constru
 */
export function tranListToTreeData(list) {
  // 1. 定义两个变量
  const treeList = [],
    map = {}

  // 2. 建立一个映射关系，并给每个元素补充children属性.
  // 映射关系: 目的是让我们能通过id快速找到对应的元素
  // 补充children：让后边的计算更方便
  list.forEach(item => {
    if (item.id === item.parentId) {
      item.parentId = ''
    }
    if (!item.children) {
      item.children = []
    }
    map[item.id] = item
  })

  // 循环
  list.forEach(item => {
    // 对于每一个元素来说，先找它的上级
    //    如果能找到，说明它有上级，则要把它添加到上级的children中去
    //    如果找不到，说明它没有上级，直接添加到 treeList
    const parent = map[item.parentId]
    // 如果存在上级则表示item不是最顶层的数据
    if (parent) {
      parent.children.push(item)
    } else {
      // 如果不存在上级 则是顶层数据,直接添加
      treeList.push(item)
    }
  })
  // 返回
  return treeList
}

// 树形结构数据转单层数组形式
export function treeToArray(data) {
  return data.reduce((result, current) => {
    let { children, ...others } = current
    result.push({ ...others })
    if (current.children) {
      result = [...result, ...treeToArray(current.children)]
    }
    return result
  }, [])
}

// 根据树结构从树结构数据中获取节点数据 fn回调返回boolean
export function getTreeNode(treeList, fn) {
  for (let i = 0; i < treeList.length; i++) {
    let treeItem = treeList[i]
    if (fn(treeItem)) {
      return treeItem
    } else {
      if (treeItem.children && treeItem.children.length > 0) {
        let res = getTreeNode(treeItem.children, fn)
        if (res) {
          return res
        }
      }
    }
  }
}

/*
  生成唯一id
*/
export function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}
// 计算相差的天数
/**
 * 计算天数差的函数，通用
 * @param sDate1
 * @param sDate2
 * @returns {Number}天数
 */
export function DateDiff(sDate1, sDate2) {
  //sDate1和sDate2是2006-12-18格式
  sDate1 = dayjs(sDate1).format('YYYY-MM-DD').toString()
  sDate2 = dayjs(sDate2).format('YYYY-MM-DD').toString()
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split('-')
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式
  aDate = sDate2.split('-')
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24 + '', 10) //把相差的毫秒数转换为天数
  return iDays
}

export const roundFixed = (num, fixed) => {
  //修改js四舍五入
  let pos = num.toString().indexOf('.')
  let decimal_places = num.toString().length - pos - 1
  let _int = num * Math.pow(10, decimal_places)
  let divisor_1 = Math.pow(10, decimal_places - fixed)
  let divisor_2 = Math.pow(10, fixed)
  return Math.round(_int / divisor_1) / divisor_2
}

/**
 * 数字格式化
 * @param s 需要格式化数字,最少保留2位小数,最大保留max位小数, 并去除小数部分末位多余的0
 * @type int
 * @returns
 */
export const formatMoneyWithDecimal = (s, max: number = 8) => {
  if (!s || s === '') {
    return '0.00'
  }
  s = s.toString()
  let decimal = s.split('.')[1]
  if (!decimal || decimal.length < 2) {
    s = parseFloat(s).toFixed(2)
  }
  if (decimal && decimal.length > max) {
    s = parseFloat(s).toFixed(8)
  }
  let integer = s.split('.')[0]
  decimal = s.split('.')[1]
  //去除小数部分末位多余的0
  if (decimal && decimal.length > 2) {
    let zeroCount = 0
    for (let i = decimal.length - 1; i >= 2; i--) {
      if (decimal[i] === '0') {
        zeroCount++
      } else {
        break
      }
    }
    decimal = decimal.substring(0, decimal.length - zeroCount)
  }

  return integer.replace(/\B(?=((\d{3})+(?!\d)))/g, ',') + (decimal ? `.${decimal}` : '')
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const moveInArray = (arr: any[], fromIndex: number, toIndex: number) => {
  var element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}

export function goLink(url, type = '_blank') {
  let win = window.open('about:' + type)
  win.location.href = url
}

// 科目编码大小比较
export function compareSubject(start, end, level) {
  let rule = level.split('-')
  let count = 0
  let pass = true
  for (let i = 0; i < rule.length; i++) {
    const item = Number(rule[i])
    let subStart = start.substr(count, item)
    let subEnd = end.substr(count, item)
    if (Number(subStart || 0) > Number(subEnd) && subEnd !== '') {
      pass = false
    }
    if (Number(subStart) < Number(subEnd)) {
      break
    }
    count += item
  }

  return pass
}

/**
 * 对比两个对象是否相等
 * @param oldObj
 * @param newObj
 * @param removeNoiseKey 排除一些不参与比较的字段
 * @returns
 */
export function isEqualObject(oldObj: any = {}, newObj: any = {}, removeNoiseKey: string[] = []) {
  let copyStateOld = cloneDeep(oldObj)
  let copyStateNew = cloneDeep(newObj)
  for (let i = 0, len = removeNoiseKey.length; i < len; i++) {
    delete copyStateOld[removeNoiseKey[i]]
    delete copyStateNew[removeNoiseKey[i]]
  }
  let objKeys = Object.keys(copyStateOld)
  let equal = true
  for (let i = 0, len = objKeys.length; i < len; i++) {
    if (copyStateNew[objKeys[i]] !== undefined && copyStateOld[objKeys[i]] !== copyStateNew[objKeys[i]]) {
      equal = false
    }
  }
  return equal
}

/**
 * 数组根据key去重
 * @param array
 * @param key
 * @returns
 */
export function removeDuplicatesByKey(array, key) {
  // 使用一个空对象作为映射表，键为id，值为对象本身
  const idMap = {}

  // 遍历数组，将对象添加到映射表中，只保留第一个出现的对象
  const uniqueArray = array.filter(item => {
    let _key = (item[key] || '').toString()
    if (!idMap[_key]) {
      idMap[_key] = true
      return true
    }
    return false
  })

  return uniqueArray
}

/**
 * 添加掩码
 * @param array
 * @param key
 * @returns
 */
export function maskString(str) {
  if (!str || str.length <= 2) {
    // 如果字符串长度小于或等于2，则无法添加掩码
    return str
  }

  // 计算掩码长度
  let maskLength = str.length - 2
  let mask = '*'.repeat(maskLength)

  // 提取字符串开头和结尾的字符
  let start = str.charAt(0)
  let end = str.charAt(str.length - 1)

  // 组合成最终的掩码字符串
  let maskedStr = start + mask + end
  return maskedStr
}

// 获取当前的 dom tab
export const getModalContainer: any = () => {
  const domList = [...document.getElementById('page-container-content-unique-id').children]
  const curDom = domList.find((item: any) => {
    return item.style.display === 'block'
  })
  return curDom
}

/**
 * 转换下字典，方便取value对应的label
 * @param list
 * @returns
 */
export const transformDictListToMap = list => {
  let labelValueMap = {}
  list.forEach(item => {
    labelValueMap[item.value] = item.label
  })
  return labelValueMap as { [key: string]: string }
}
