import axios from 'axios'
// import Qs from 'qs'
import router from '@/router/index'
import store from '@/store/index'
import { Message } from 'element-ui'

const toLogin = () => {
    router.push({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

const api = axios.create({
    baseURL: process.env.VUE_APP_API_ROOT,
    timeout: 10000,
    responseType: 'json'
    // withCredentials: true
})

const noNeedTokenUrl = ['/auth/oauth/token']
const noDoResultUrl = [  '/auth/oauth/token',  '/user/user/info', '/user/user/getSysPermission']

api.interceptors.request.use(
    request => {
        // if (request.method == 'post') {
        //     console.log(request);
        //     if (request.data instanceof FormData) {
        //         if (store.getters['user/isLogin']) {
        //             console.log(store.state.user.token);
        //             // 如果是 FormData 类型（上传图片）
        //             request.data.append('token', store.state.user.token)
        //         }
        //     } else {
        //         // 带上 token
        //         if (request.data == undefined) {
        //             request.data = {}
        //         }
        //         if (store.getters['user/isLogin']) {
        //             console.log(store.state.user.token);
        //             request.data.token = store.state.user.token
        //         }
        //         // request.data = Qs.stringify(request.data)
        //     }
        // } else {
        //     // 带上 token
        //     if (request.params == undefined) {
        //         request.params = {}
        //     }
        //     if (store.getters['user/isLogin']) {
        //         request.params.token = store.state.user.token
        //     }
        // }
        request.headers['Content-Type'] = 'application/json;charset=UTF-8'
        if (noNeedTokenUrl.indexOf(request.url) < 0) {
            // 从store中获取到token
            const userInfo = store.state.user.token
            const token = userInfo.access_token
            request.headers['Authorization'] = 'Bearer ' + token
        } else {
            // 设置默认token
            request.headers['Authorization'] = 'Basic ' + 'bG9vbmdhaXJfd2ViOmxvb25nYWly'
        }
        return request
    }
)

api.interceptors.response.use(
    response => {
        // console.log(response);
        // if (response.data.error != '') {
        //     // 如果接口请求时发现 token 失效，则立马跳转到登录页
        //     if (response.data.status == 0) {
        //         toLogin()
        //     }
        //     Message.error(response.data.error)
        //     return Promise.reject(response.data)
        // }
        // return Promise.resolve(response.data)
        let url = response.config.url
        // 错误码
        let errorCode = response.data['ErrorCode']
        let {status} = response
        if (status === 200) {
            if (errorCode === 0) {
                return response.data['Result']
            } else {
                // 如果没有errorCode
                if (!errorCode) {
                    // 如果该接口是不需要对Result字段做处理的
                    if (noDoResultUrl.indexOf(url) > -1) {
                        return response.data
                    }
                    return
                }
                let message = response.data.Message
                // 如果有errorCode 则进行错误拦截
                switch (errorCode) {
                    case 1:
                        if (message) {
                            Message.error(message)
                            break
                        }
                        Message.error('未知错误')
                        break
                    // case 1000:
                    //   //1000一般代表用户权限校验失败，所以一旦报错了，就可以退出登录了
                    //   if (message) {
                    //     Message.error(message);
                    //     store.dispatch('user/removeUserInfo').then(() => {
                    //       router.replace('/login');
                    //     });
                    //     break;
                    //   }
                    //   Message.error("未知错误");
                    //   store.dispatch('user/removeUserInfo').then(() => {
                    //     router.replace('/login');
                    //   });
                    //   break;
                    default:
                        if (message) {
                            Message.error(message)
                            break
                        }
                        Message.error('未知错误')
                        break
                }
                return Promise.reject()
            }
        }
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    Message.error('登录过期请重新登录！')
                    this.$router.replace('/login').then()
                    break
                case 403:
                    Message.error('暂无权限！')
                    break
                case 500:
                    Message.error('系统繁忙，请稍后重试')
                    break
                case 404:
                    Message.error('请求资源不存在！')
                    break
                default:
                    Message.error('未知错误')
                    break
            }
        } else {
            Message.error('请求超时，请重试')
        }
        return Promise.reject(error)
    }
)

export default api
