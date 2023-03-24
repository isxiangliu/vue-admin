import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import api from './api'
Vue.prototype.$api = api

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import auth from './util/auth'
Vue.use(auth)

import cookies from 'vue-cookies'
Vue.use(cookies)

import VueMeta from 'vue-meta'
Vue.use(VueMeta)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import hotkeys from 'hotkeys-js'
Vue.prototype.$hotkeys = hotkeys

// 全局组件自动注册
import './components/autoRegister'

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import './assets/styles/reset.scss'

import './mock'

Vue.config.productionTip = false

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
import echartsTheme from '@/util/echarts-theme'
// 引入柱状图图表，图表后缀都为 Chart
import {
    BarChart,
    LineChart,
    GaugeChart,
    PieChart,
    MapChart,
    EffectScatterChart,
    RadarChart,
    CustomChart
} from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    GeoComponent,
    DataZoomComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    BarChart,
    LineChart,
    GaugeChart,
    PieChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    GeoComponent,
    MapChart,
    EffectScatterChart,
    RadarChart,
    DataZoomComponent,
    CustomChart
]);
echarts.registerTheme('custom-theme', echartsTheme);
Vue.prototype.$echarts = echarts;

Vue.prototype.$eventBus = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
