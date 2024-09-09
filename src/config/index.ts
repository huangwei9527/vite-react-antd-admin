// 是否开始调试模式
export const debuggerMode = import.meta.env.VITE_DEBUGGER_MODE === 'true'
// 环境区分
export const isDev = import.meta.env.VITE_ENV_NAME === 'development'
export const isTest = import.meta.env.VITE_ENV_NAME === 'test'
export const isProduction = import.meta.env.VITE_ENV_NAME === 'production'
// base url
export const BASE_URL = import.meta.env.VITE_BASE_URL
// 静态资源目录
export const STATIC_RESOURCE = ''
