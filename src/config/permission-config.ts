import store from '@/store'
import { isReadSiteNotice, noPermissionNotice } from '@/common/helps/application'

/**
 * Permission Codes 权限码
 * 左边全大写，右边是对应的权限码
 * 左边命名规则：
 *    财税模块名_财税子模块名_功能名
 *
 * 部分已知模块名取值：
 *   HOME: 首页
 *   CA： 出纳
 *   VAT: 发票
 *   SYS: 系统
 *   FA： 固定资产
 *   BS： 基础资料
 *   RPT: 报表
 *   PRINT: 套打，打印
 *   GL: 总帐，会计科目，辅助核算，凭证，账簿等
 *   WAGE: 工资
 *   TAX: 税务
 *
 * 部分已知财税子模块取值（这个待补充）：
 *   BANK: 银企互联
 *
 * 部分已知功能名取值（这个比较灵活）:
 *   EDIT: 编辑
 *   DELETEE: 删除
 *   ADD: 新增
 *   CHANGE: 修改
 */
export const PMCodes = {
  /**
   * 首页
   */
  HOME_FINANCIAL: 73, // 财务指标
  HOME_FINANCIAL_SET: 71, // 财务指标_设置
  HOME_NEWTHREE: 73, // 新三板
  HOME_NEW_BENCH_MARKING: 73, // 行业对标板

  /**
   * GL模块
   */
  GL_LEDGER: 111, //总账
  GL_SUB_LEDGER: 121, //明细账
  GL_ACCOUNT: 501, //账户

  /**
   * 报表
   */
  RPT_BALANCE_SHEET: 151, //资产负债表
  RPT_PROFIT_SHEET: 162, //利润表
  RPT_CASH_REPORT_EXPORT: 215, //现金流量表-导出
  RPT_FIN_INIT_EXPORT: 213, //财务初始余额-导出

  BALANCE_RPT_BY_ACCOUNT: 142, //科目余额表-查看

  /**
   * 自定义报表
   */
  RPT_DEF_VIEW: 361,
  RPT_DEF_EDIT: 362,
  RPT_DEF_DELETEE: 363,
  RPT_DEF_PRINT: 364,
  RPT_DEF_EXPORT: 365,
  RPT_DEF_SHARE: 366,
  RPT_DEF_COPY: 367,

  /**
   * 发票
   */
  VAT_MANAGE: 930, //发票管理
  VAT_RECOGNITION: 944, //识别
  VAT_VERIFY: 945, //查验
  VAT_UPLOAD_IMG: 946, //上传影像
  VAT_VOUCHER_TEMP: 940, //凭证模板
  VAT_BURDEN: 960, //税负测算
  VAT_BURDEN_EDIT: 961, //税负测算编辑

  /**
   * 出纳
   */

  // 日记账
  JOURNAL_ADD: 510, // 日记账-新增/编辑
  JOURNAL_LOOK: 511, // 日记账-查看
  JOURNAL_REMOVE: 721, // 日记账-删除
  JOURNAL_REMOVE_VOUCHER: 94, // 日记账-删除凭证
  JOURNAL_OPEN_VOUCHER: 93, // 日记账-打开凭证
  JOURNAL_PRINT: 512, // 日记账-打印
  JOURNAL_EXPORT: 513, // 日记账-导出
  JOURNAL_IMPORT: 722, // 日记账-导入
  JOURNAL_BATCH_REMOVE: 721, // 日记账-批量删除
  JOURNAL_VOUCHER_REMOVE: 94, // 日记账-列表-删除凭证

  // 收支汇总
  INCOME_EXPENSE_PRINT: 531, // 收支汇总表-打印
  INCOME_EXPENSE_EXPORT: 532, // 收支汇总表-导出

  // 账户

  // 银行对账
  CA_BANKRECONCILE_EDIT: 892, //编辑
  CA_BANKRECONCILE_ADD: 893, //新增
  CA_BANKRECONCILE_DEL: 894, //银行对账删除
  CA_BANKRECONCILE_EXPORT: 895, //银行对账导出
  CA_BANKRECONCILE_PRINT: 896, //银行对账打印
  // 银行存款对账
  CA_BANKSR_EXPORT: 513, //银行存款对账导出
  // 银行余额调节表
  CA_BANK_BJ_PRINT: 512, //银行余额调节表打印

  /**
   * 固定资产
   */

  /**
   * 基础资料
   */
  BS_CASHFLOW_EDIT: 217, //现金流量表编辑
  BS_FIN_INIT_EDIT: 211, //财务初始余额编辑

  /**
   * 财税
   */

  // 银企互联
  CA_BANK_SIGN: 999999, // 签约功能
  CA_BANK_EDIT: 999998,
  /**
   * 发票
   */
  TAX_RECOGNITION: 944, //识别
  TAX_VERIFY: 945, //查验
  TAX_UPLOAD_IMG: 946, //上传影像
  TAX_VOUCHER_TEMP: 940, //凭证模板

  // 系统设置
  SYSTEM_PARAMETER: 830
}

/**
 * 权限判断方法
 * @param code 权限码 支持数组
 * @param showNoPermissionTips 是否显示无权限提示
 * @returns {boolean}
 */
export function verifyPermission(code, showNoPermissionTips = false) {
  const { systemInitData, permissions } = store.getState().app
  const isAdmin = systemInitData.isAdmin
  const siExperied = systemInitData.siExpired
  const isReadSite = systemInitData.isReadSite
  const permissionsList: any = permissions
  const verifyFn = (c: any) => {
    if (!c) {
      return true
    }
    if (isAdmin && !siExperied && !isReadSite) {
      return true
    }
    if (!Array.isArray(c)) {
      return !c || permissionsList.includes(Number(c) || 0)
    }
    if (c.length === 1) {
      return !c[0] || permissionsList.includes(Number(c[0]))
    }
    // 只要有一个匹配则认为有权限
    for (let i = 0, len = c.length; i < len; i++) {
      if (permissionsList.includes(Number(c[i]))) {
        return true
      }
    }
    return false
  }
  const hasAuth = verifyFn(code)
  if (hasAuth || !showNoPermissionTips) {
    return hasAuth
  }
  showNoPermissionDialog()
  return hasAuth
}

export const hasAuth = verifyPermission // 换个简单的name

export function showNoPermissionDialog() {
  const { systemInitData } = store.getState().app
  const isReadSite = systemInitData.isReadSite
  // 显示提示
  if (isReadSite) {
    isReadSiteNotice()
  } else {
    noPermissionNotice()
  }
}
