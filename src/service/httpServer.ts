import axios from 'axios'
import * as $config from '@/config/index'
import { message } from 'antd'
import QS from 'qs'
import { redirectLogout } from '@/common/helps/application'

export const SERVER_MESSAGE_KEY = 'serverMessageTips'

// 线上环境配置axios.defaults.baseURL，开发环境则用proxy代理
axios.defaults.baseURL = $config.BASE_URL
// axios.defaults.timeout = $config.isTest ? 300000 : 30000 // 超时时间
axios.defaults.withCredentials = true // 允许携带cookie

// 接口报错归集到同一个tips，防止批量报错时弹出一堆tips
const MessageError = str => {
  message.error({
    content: str,
    key: SERVER_MESSAGE_KEY
  })
}

/**
 * 下载文件
 */
const downloadFile = url => {
  window.open(url)
}

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // let accessToken = localStorage.getItem('accessToken') || 'access_token'
    if (localStorage.getItem('accessToken') && config.url.startsWith('/')) {
      config.headers['app-token'] = localStorage.getItem('accessToken')
    }
    // config.headers.Authorization = config.headers.Authorization || store.getters.authorization
    // config.headers['Access-Control-Allow-Origin'] = '*'
    if (config.method === 'get') {
      config.data = { unused: 0 } // 这个是关键点，加入这行就可以了,解决get,请求添加不上Content-Type
    }
    config.params = config.params ? config.params : {}
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
    if (response.data.status) {
      return Promise.resolve(response.data || {})
    } else {
      if (response.data.code === 401) {
        redirectLogout()
        return
      }
      return Promise.reject(response.data.message || response.data.msg || response.data.errMsg || response.data.description)
    }
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break
        case 401:
          err.message = '未授权，请重新登录'
          redirectLogout()
          break
        case 403:
          err.message = '没有访问权限，拒绝访问'
          break
        case 404:
          err.message = '请求错误,未找到该资源'
          break
        case 405:
          err.message = '请求方法未允许'
          break
        case 500:
          err.message = err.response.data.message || '服务器端出错'
          break
        default:
          err.message = `连接错误${err.response.msg}`
      }
    } else {
      err.message = '连接到服务器失败'
    }
    if (err?.response?.status !== 401) {
      MessageError(err.message || err.response.msg)
    }

    return Promise.reject(err.response)
  }
)

export default {
  // get请求 cache字段来标识是否添加缓存
  get(url: string, param?: any, header?: any) {
    return axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json;charse=UTF-8',
        ...(header || {})
      },
      params: param || {}
    })
  },
  // post请求
  post(url: string, param?: any, header?: any) {
    return axios({
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/json;charse=UTF-8',
        ...(header || {})
      },
      data: param || {}
    })
  },
  // post请求
  put(url: string, param?: any, header?: any) {
    return axios({
      method: 'put',
      url,
      headers: {
        'Content-Type': 'application/json;charse=UTF-8',
        ...(header || {})
      },
      data: param || {}
    })
  },
  // delete
  delete(url: string, param?: any, header?: any) {
    return axios({
      method: 'delete',
      url,
      headers: {
        ...(header || {})
      },
      data: param || {}
    })
  },
  // post请求
  postFormData(url: string, param?: any, header?: any, extraConfig?: any) {
    return axios({
      method: 'post',
      url,
      headers: {
        ...(header || {}),
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: QS.stringify(param) || {},
      ...{ ...(extraConfig || {}) }
    })
  },
  // post file请求, 兼容老版本  支持el-upload文件格式上传
  postFile(url: string, param?: any, header?: any) {
    const tempParams = new FormData()
    Object.keys(param || {}).forEach(key => {
      tempParams.append(key, param[key])
    })
    return axios({
      method: 'post',
      url,
      headers: {
        ...(header || {}),
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: tempParams
    })
  },
  // 此方法非promise 导出文件
  getFile(url: string, params?: any) {
    const tempParams = {
      ...(params || {})
    }
    // 拼接下载地址
    const list = []
    for (const key in tempParams) {
      list.push(key.toString() + '=' + tempParams[key])
    }
    // url = /^http(s?):\/\//.test(url) ? url : $config.baseURL + url
    url = list.length ? url + '?' + list.join('&') : url
    url = encodeURI(url)
    downloadFile(url)
  },
  jsonp(url: string, params?: any, callbackFnName?: any) {
    if (!url) {
      console.error('Axios.JSONP 至少需要一个url参数!')
      return
    }
    return new Promise((resolve, reject) => {
      let callbackName: string = callbackFnName ? callbackFnName : 'callback' + +new Date()
      window[callbackName] = (result): any => {
        resolve(result)
      }
      let JSONP = document.createElement('script')
      JSONP.type = 'text/javascript'
      const tempParams = {
        callback: callbackName,
        ...(params || {})
      }
      const list = []
      for (const key in tempParams) {
        list.push(key.toString() + '=' + tempParams[key])
      }
      JSONP.src = `${url}?${list.join('&')}`
      document.getElementsByTagName('head')[0].appendChild(JSONP)
      setTimeout(() => {
        document.getElementsByTagName('head')[0].removeChild(JSONP)
      }, 1500)
    })
  }
}
export interface NormalResponse<T> {
  errcode: number
  description: string
  data: T
}
