import api from '@/api'
import { login } from '@/api/user'

const state = {
    token: localStorage.token || '',
    permissions: []
}

const getters = {
    isLogin: state => {
        let retn = false
        if (state.token) {
            retn = true
        }
        return retn
    }
}

const actions = {
    login({ commit }, data) {
        const { username, password } = data;
        return new Promise((resolve, reject) => {
            // login({
            //     grant_type: "password",
            //     scope: "server",
            //     username: username,
            //     password: password,
            //     rememberMe: false
            // }).then((res) => {
            //     commit('setUserData', res)
            //     resolve(res)
            // }).catch(error => {
            //     reject(error)
            // })
            commit('setUserData', {'access_token': '9ff0bedf-adb6-436c-9d73-c2e36256a3c8'})
            resolve({'access_token': '9ff0bedf-adb6-436c-9d73-c2e36256a3c8'})
        })
    },
    logout({ commit }) {
        commit('removeUserData')
        commit('menu/invalidRoutes', null, { root: true })
    },
    // 获取我的权限
    getPermissions({ state, commit }) {
        return new Promise(resolve => {
            // 通过 mock 获取权限
            api.get('mock/member/permission', {
                params: {
                    account: state.account
                }
            }).then(res => {
                commit('setPermissions', res.data.permissions)
                resolve(res.data.permissions)
            })
        })
    }
}

const mutations = {
    setUserData(state, data) {
        localStorage.setItem('token', data.access_token)
        state.token = data.access_token
    },
    removeUserData(state) {
        localStorage.removeItem('token')
        state.token = ''
    },
    setPermissions(state, permissions) {
        state.permissions = permissions
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
