import * as $config from '@/config'
let menu: IMenuItem[] = [
  {
    title: '首页',
    id: 'home',
    icon: 'iconfont icon-home',
    icon_active: 'iconfont icon-home',
    path: '/'
  },
  {
    title: '监控大屏',
    id: 'big-screen',
    icon: 'iconfont icon-jiankongdaping',
    icon_active: 'iconfont icon-jiankongdaping',
    path: '/'
  },
  {
    title: 'xx管理',
    id: 'car-manage',
    icon: 'iconfont icon-cheliangguanli',
    icon_active: 'iconfont icon-cheliangguanli',
    menus: [
      {
        title: 'xx管理',
        icon: 'iconfont icon-cheliangguanli',
        menus: [
          {
            title: 'xx信息',
            id: 'car/manage/detail',
            path: '/car/manage/detail',
            dataRight: '91'
          },
          {
            title: 'xx记录',
            id: 'car/manage/import',
            path: '/car/manage/import',
            dataRight: '93'
          },
          {
            title: 'xxx',
            id: 'car/manage/install',
            path: '/car/manage/install',
            dataRight: '93'
          }
        ]
      }
    ]
  },
  {
    title: 'xxx管理',
    id: 'equipment-manage',
    icon: 'iconfont icon-shebeiguanli',
    icon_active: 'iconfont icon-shebeiguanli',
    menus: [
      {
        title: 'xxx管理',
        icon: 'iconfont icon-yingjiantanzhen',
        menus: [
          {
            title: 'xxx查询',
            id: 'equipment/t/detail',
            path: '/car/manage/detail',
            dataRight: '91'
          },
          {
            title: 'xxx记录',
            id: 'equipment/t/import',
            path: '/car/manage/import',
            dataRight: '93'
          }
        ]
      },
      {
        title: 'xxxx管理',
        icon: 'iconfont icon-shexiangtou',
        menus: [
          {
            title: 'xxxx查询',
            id: 'equipment/s/detail',
            path: '/car/manage/detail',
            dataRight: '91'
          },
          {
            title: 'xx记录',
            id: 'equipment/s/import',
            path: '/car/manage/import',
            dataRight: '93'
          }
        ]
      },
      {
        title: 'xx管理',
        icon: 'iconfont icon-shebeileinvr',
        menus: [
          {
            title: 'xx查询',
            id: 'nvr/n/detail',
            path: '/car/manage/detail',
            dataRight: '91'
          },
          {
            title: 'xx记录',
            id: 'nvr/n/import',
            path: '/car/manage/import',
            dataRight: '93'
          }
        ]
      }
    ]
  },
  {
    title: 'xxxx管理',
    id: 'lk-manage',
    icon: 'iconfont icon-lukou',
    menus: [
      {
        title: 'xx管理',
        icon: 'iconfont icon-lukou',
        menus: [
          {
            title: 'xx信息列表',
            id: 'lk/l/detail',
            path: '/car/manage/detail',
            dataRight: '91'
          },
          {
            title: 'xx监测设备',
            id: 'lk/l/import',
            path: '/car/manage/import',
            dataRight: '93'
          }
        ]
      }
    ]
  },
  {
    title: '系统设置',
    id: 'sys',
    icon: 'iconfont icon-shezhi1',
    icon_active: 'iconfont icon-shezhi1',
    menus: [
      {
        title: '系统设置',
        icon: 'iconfont icon-xitongcanshu',
        menus: [
          {
            title: '参数设置',
            id: 'sys/list',
            path: '/voucher/voucherList',
            dataRight: '93'
          },
          {
            title: '字典管理',
            id: 'sys/dict',
            path: '/setting/dictionary',
            dataRight: ['sys/dict/list', 'sys/dict/add', 'sys/dict/edit', 'sys/dict/delete']
          },
          {
            title: '组织机构',
            id: 'sys/org',
            path: '/setting/org-manage',
            dataRight: ['sys/org/list', 'sys/org/add', 'sys/org/edit', 'sys/org/delete']
          },
          {
            title: '角色管理',
            id: 'sys/role',
            path: '/setting/role-manage',
            dataRight: ['sys/role/list', 'sys/org/add', 'sys/org/edit', 'sys/org/delete']
          },
          {
            title: '用户管理',
            id: 'sys/user',
            path: '/setting/user-manage',
            dataRight: ['sys/user/list', 'sys/user/add', 'sys/user/edit', 'sys/user/delete']
          }
        ]
      },
      {
        title: '日志管理',
        icon: 'iconfont icon-rizhi',
        menus: [
          {
            title: '登录日志',
            id: 'setting/login-log',
            path: '/setting/login-log',
            dataRight: '91'
          },
          {
            title: '操作日志',
            id: 'setting/operation-log',
            path: '/setting/operation-log',
            dataRight: '93'
          }
        ]
      }
    ]
  },
  {
    title: '开发模版',
    id: 'dev-demo',
    icon: 'iconfont icon-ruanjiankaifabao',
    icon_active: 'iconfont icon-ruanjiankaifabao',
    path: '/dev-demo/index'
    // runDevelopment: ['dev']
  }
]

// 根据runDevelopment过滤掉特定环境下的路由, 暂时只处理一级导航
menu = menu.filter((m: IMenuItem) => {
  return (
    !m.runDevelopment ||
    ($config.isDev && m.runDevelopment.includes('dev')) ||
    ($config.isTest && m.runDevelopment.includes('test')) ||
    ($config.isProduction && m.runDevelopment.includes('production'))
  )
})
// menu end
export default menu

export interface IMenuItem {
  id?: string
  title: string
  path?: string
  isIframe?: boolean // 是否是iframe嵌套
  isPermanent?: true // 是否常驻 首页常驻
  dataRight?: string | number | number[] | string[]
  icon?: string
  href?: string
  runDevelopment?: string | string[] // 运行环境, 非特殊要求不需要加该参数, 默认线上, [local, dev, test, production]
  menus?: IMenuItem[]
  [key: string]: any
}

/**
 * 通过name获取当前菜单数据
 * @param name
 */
export function getMenuDataByName(name, menuList) {
  if (!menuList) {
    menuList = menu
  }
  for (let i = 0, len = menuList.length; i < len; i++) {
    if (menuList[i].title === name) {
      return menuList[i]
    }
    if (!menuList[i].menus || menuList[i].menus.length === 0) {
      continue
    }
    for (let j = 0, l = menuList[i].menus.length; j < l; j++) {
      let d = menuList[i].menus[j].menus.find(v => v.title === name)
      if (d) {
        return d
      }
    }
  }
  return null
}

/**
 * 通过path获取数据
 * @param path
 */
export function getMenuDataByHref(path: string, defList?: IMenuItem[]) {
  let menuData = defList || menu
  for (let i = 0, len = menuData.length; i < len; i++) {
    if (menuData[i].path === path) {
      return menuData[i]
    }
    if (!menuData[i].menus || menuData[i].menus.length === 0) {
      continue
    }
    for (let j = 0, l = menuData[i].menus.length; j < l; j++) {
      let d = menuData[i].menus[j].menus.find(v => v.path === path)
      if (d) {
        return d
      }
    }
  }
  return null
}

/**
 * 通过id 获取数据
 * @param id
 */
export function getMenuDataById(id: string, defList?: IMenuItem[]) {
  if (!id) {
    return null
  }
  let menuData = defList || menu
  for (let i = 0, len = menuData.length; i < len; i++) {
    if (menuData[i].id === id) {
      return menuData[i]
    }
    if (!menuData[i].menus || menuData[i].menus.length === 0) {
      continue
    }
    for (let j = 0, l = menuData[i].menus.length; j < l; j++) {
      let d = menuData[i].menus[j].menus.find(v => v.id === id)
      if (d) {
        return d
      }
    }
  }
  return null
}

/**
 * 获取所有子节点列表
 */
export function getMenuChildrenNode(menuItem: IMenuItem) {
  let lsit = []
  if (!menuItem.menus || menuItem.menus.length === 0) {
    return lsit
  }
  for (let j = 0, l = menuItem.menus.length; j < l; j++) {
    lsit = [...lsit, ...(menuItem.menus[j].menus || [])]
  }
  return lsit
}
