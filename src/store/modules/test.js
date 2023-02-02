// 模板
// 文件默认开启命名空间，文件名会默认注册为模块名，使用方法：
// this.$store.state.example.xxx;
// this.$store.getters['example/xxx'];
// this.$store.dispatch('example/xxx');
// this.$store.commit('example/xxx');
const state = {}
const getters = {}
const actions = {}
const mutations = {}
export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
