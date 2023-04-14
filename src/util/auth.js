import { auth, authAll } from '@/util'

export default {
    install(Vue) {
        Vue.prototype.$auth = auth
        Vue.prototype.$authAll = authAll
        // 注册 v-auth 和 v-auth-all 指令
        Vue.directive('auth', {
            inserted: (el, binding) => {
                if (!auth(binding.value)) {
                    el.remove()
                }
            }
        })
        Vue.directive('auth-all', {
            inserted: (el, binding) => {
                if (!authAll(binding.value)) {
                    el.remove()
                }
            }
        })

        // 节流
        Vue.directive('throttle', {
            inserted: function(el, binding) {
                el.addEventListener('click', () => {
                    if (!el.disabled) {
                        el.disabled = true
                        setTimeout(() => {
                            el.disabled = false
                        }, binding.value || 1500)
                    }
                })
            }
        })
        
        // 防抖
        Vue.directive('debounce', {
            inserted: function(el, binding) {
                let timer
                el.addEventListener('click', () => {
                    if (timer) {
                        clearTimeout(timer)
                    }
                    timer = setTimeout(() => {
                        binding.value()
                    }, 1500)
                })
            }
        })
    }
}
