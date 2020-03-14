import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'http://47.112.243.214:9001/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const path = router.history.current.path

    // if the custom code is not 20000, it is judged as an error.
    if ((res.errCode >= 200 && res.errCode < 300) || (res.code >= 200 && res.code < 300)) {
      return res
    } else {
      if (res.errCode === 401 && path !== '/login') {
        Message({
          message: '请重新登录后操作',
          type: 'error',
          duration: 3 * 1000
        })
        store.dispatch('user/resetToken')
        router.push('/login?redirect=' + path)
      }
      return Promise.reject(new Error(res.errMsg || 'Error'))
    }
  },
  error => {
    const path = router.history.current.path

    if (error.toString() === 'Error: Request failed with status code 404') {
      Message({
        message: '请重新登录后操作',
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('user/resetToken')
      router.push('/login?redirect=' + path)
    }
    return Promise.reject(error)
  }
)

export default service
