import Big from 'big.js'

const isNumber = (value: unknown): value is number => typeof value === 'number'

export function getNumberColor(val: number) {
  if (val >= 0) return 'color: #FF5F1F'
  return 'color: #E54752'
}

export function getNumberSymbol(val?: number) {
  if (val === null || val === undefined) {
    return ''
  }
  if (val >= 0) return '+'
  return '-'
}

/**
 * 添加千分号,并且不对小数位进行改动,注意: 输入+5645.558会返回+5,654.558保留正号
 * @param num
 * @returns
 */
export function addThouComma(num: string | number, showZero?: boolean) {
  if (showZero && !num) {
    return '0.00'
  }
  if (!num) {
    return ''
  }
  let str = num.toString()
  let result = ''
  let neg = false
  if (str.indexOf('-') > -1) {
    str = str.substring(1, str.length)
    neg = true
  }
  let decimalIndex = str.indexOf('.')
  if (decimalIndex === -1) {
    decimalIndex = str.length
  }
  for (let i = decimalIndex - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      result = ',' + result
    }
    result = str[i] + result
  }
  if (neg) {
    result = '-' + result
  }
  if (decimalIndex !== str.length) {
    result += str.slice(decimalIndex)
  }
  return result
}

/**
 * 例子: val: 9999 返回 9,999.00
 * @param val li
 * @param fixedLength
 */
export function getFormattedNumber(val?: number | string, fixedLength = 2) {
  if (val == null || typeof val === 'undefined') {
    return ''
  }
  let fixedVal = Number(val).toFixed(fixedLength)
  let fixedStr = fixedVal.toString()
  return addThouComma(fixedStr)
  // let n = fixedVal.length - 1;
  // let res = '';
  // let meetDot = false;
  // let j = 1;
  // for (let i = n; i >= 0; i--) {
  //   res = fixedVal[i] + res;
  //   if (meetDot && j % 3 == 0 && i != 0) {
  //     res = ',' + res;
  //   }
  //   if (meetDot) {
  //     j++;
  //   }
  //   if (fixedVal[i] === '.') {
  //     meetDot = true;
  //   }
  // }
  // return res;
}

/**
 * 例子: val: 9999 返回 9,999.00
 * @param val li
 * @param fixedLength
 */
export function getFormattedNumberWithLimit(val?: number | string, fixedLength = 2) {
  if (val == null || typeof val === 'undefined') {
    return ''
  }
  let exceed = false
  //大于等于100亿
  if (Number(val) >= 10000000000) {
    exceed = true
  }
  let div = 10 ** fixedLength
  let fixedVal = exceed ? parseInt(((Number(val) / 100000000) * div) as any) / div : Number(val).toFixed(fixedLength)
  let fixedStr = fixedVal.toString()
  let res = addThouComma(fixedStr)
  if (exceed) {
    res = `≥${res}亿`
  }
  return res
}

/**
 * 例子: val: 0.95 返回 95%
 * @param val
 * @param fixedLength
 */
export function getPercentage(val?: number | string, fixedLength = 2) {
  if (typeof val === 'string') {
    val = parseFloat(val)
  }
  if (val == null || val === undefined) return ''
  return (val * 100).toFixed(fixedLength) + '%'
}

/**
 * 例子: val: 0.95 返回 95
 * @param val
 * @param fixedLength
 */
export function toP(val?: number | string, fixedLength = 2) {
  if (typeof val === 'string') {
    val = parseFloat(val)
  }
  if (val == null || val === undefined) return ''
  return (val * 100).toFixed(fixedLength)
}

export enum PaddingDirection {
  Left,
  Right
}

/**
 * 填充到固定长度
 * @param val
 * @param fixedLength
 */
export function paddingCharToFixedLength(
  val?: number | string,
  fixedLength = 2,
  paddingChar = '0',
  direction = PaddingDirection.Left
) {
  if (val === null || val === undefined) return ''
  if (typeof val === 'number') {
    val = val.toString()
  }
  let len = val.length
  if (len >= fixedLength) return val
  let paddingText = ''
  for (let i = 0; i < fixedLength - len; i++) {
    paddingText += paddingChar
  }
  if (direction === PaddingDirection.Left) {
    return paddingText + val
  } else {
    return val + paddingText
  }
}

/**
 * 银行家算法（四舍六入五取偶） 保留1-14
 * @param value 被截取的数字
 * @param num 保留小数的位数 使用parseFloat 最多 1到14（第16位小数会截取，15准确，但是判断需要用到身后一位）
 */
export function bankCalculate(value, num) {
  //参数校验
  value = parseFloat(value)
  if (!value) {
    // 参数非数值
    return '0'
  }
  value = value + ''
  num = !parseInt(num) ? 0 : parseInt(num)
  if (num < 1) num = 1
  if (num > 14) num = 14

  //分离整数与小数
  let intValue = value.split('.')[0]
  let floatValue = value.split('.')[1]
  //如果小数部分长度少于或者等于要保留的位数 直接返回toFixed值即可
  if (!floatValue || floatValue.length <= num) return parseFloat(value).toFixed(num)

  //计算返回值
  let result = parseFloat(intValue + '.' + floatValue.substring(0, num))
  let toCheck = floatValue.substring(num)
  if (parseInt(toCheck.substring(0, 1)) < 5) return result + ''
  //如果小数部分长度仅比保留位数多一位 代表后位为0
  if (floatValue.length === num + 1) {
    let prev = floatValue.substring(num - 1, num)
    if (parseInt(toCheck) === 5 && prev % 2 === 0) {
      return result + ''
    }
  }
  return parseFloat(value.toString()).toFixed(num)
}

/**
 * 是否是零
 */
export function isZero(val: number | string) {
  return !val || val === '' || val === '0' || val === 0
}

/**
 * 保留几位小数
 * @param value 被截取的数字
 * @param decimal 保留小数的位数
 */
export function formatDecimal(value, decimal) {
  //参数校验
  if (
    value === '' ||
    value === '0' ||
    value === '0.' ||
    value === '-' ||
    value === '-0' ||
    value === '-0.' ||
    value === null ||
    value === undefined ||
    value.toString().endsWith('.') ||
    !value.toString().includes('.')
  ) {
    return value
  }
  let num: any = value.toString()
  let floatValue = num.split('.')[1]
  if (floatValue.length <= decimal) {
    return num
  }
  num = parseFloat(new Big(num).toFixed(decimal))
  return isNumber(num) ? num : num.toString()
}

/**
 * 添加千分位符且至少保留两位小数
 * 例子: val: 9999 返回 9,999.00     val: 9999.9999 返回 9,999.9999
 * @param
 */
export function addThouCommaLimitTwoDecimal(val) {
  if (val == null || typeof val === 'undefined') {
    return ''
  }
  val = val + ''
  if (!val.includes('.')) {
    return addThouComma(val) + '.00'
  }
  //分离整数与小数
  let floatValue = val.split('.')[1]
  let fixedVal = Number(val).toFixed(Math.max(2, floatValue.length)).toString()
  return addThouComma(fixedVal)
}

/**
 * 去掉千分位
 * @param str
 * @returns
 */
export function removeCommas(str: any) {
  if (!str || !(typeof str === 'number' || typeof str === 'string')) {
    return ''
  }
  return (str + '').replace(/,/g, '')
}

/**
 * 获取小数位数
 * @param num
 * @returns
 */
export function getDecimalPlaces(num) {
  const str = (num || '').toString()
  if (str?.indexOf('.') !== -1) {
    return str.split('.')[1].length
  }
  return 0
}
