import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // 本地测试打包
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // SGI的前端打包
  baseURL: '/api',
  responseType: 'json',
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Accept': 'application/json'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken()) {
      config.headers['token'] = getToken();
    }
    config.headers['language'] = store.getters.language;
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      // Message({
      //   message: res.message || 'error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 40101) {
        // to re-login
        MessageBox.confirm(store.getters.language === 'zh' ? '您已注销，您可以取消以停留在此页，或重新登录' : 'You have been logged out, you can cancel to stay on this page, or log in again',
          store.getters.language === 'zh' ? '确认登出' : 'Confirm logout', {
            confirmButtonText: store.getters.language === 'zh' ? '重新登陆' : 'Re-Login',
            cancelButtonText: store.getters.language === 'zh' ? '取消' : 'Cancel',
            type: 'warning'
          }).then(() => {
          store.dispatch('resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
