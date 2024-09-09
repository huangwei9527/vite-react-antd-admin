/**
 * 示例页面列表
 */
import Page1 from './page-1'
import Page2 from './page-2'
import Page3 from './page-3'
import Page4 from './page-4'
import Layout from './layout-1'
import Layout2 from './layout-2'
export default [
  {
    title: '页面模版',
    description: '基础表格 筛选 导出打印 分页 列设置',
    component: Page1
  },
  {
    title: '页面模版',
    description: '基础表格 Tab切换 导出打印',
    component: Page2
  },
  {
    title: '页面模版',
    description: '复杂筛选',
    component: Page3
  },
  {
    title: '页面模版',
    description: '左树右表页面结构',
    component: Page4
  },
  {
    title: '容器组件',
    description: '左树右表页面布局',
    component: Layout
  },
  {
    title: '容器组件',
    description: 'Tab切换, 缓存已加载状态',
    component: Layout2
  }
]
