<template>
    <div :style="{ height: height, width: width }" />
</template>
<script>
import { china } from '@/assets/utils/test'
import chart from '@/mixin/chart'
export default {
    name: 'MapChart',
    mixins: [chart],
    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        }
    },
    data() {
        return {}
    },
    created() {},
    mounted() {
        this.initChart(this.$el)
    },
    methods: {
        init(data) {
            this.renderChart(data)
        },
        /**
     * @author xiangliu
     * @description: 
     * @date 2023-03-29 15:06
     * @param: 
     */
        renderChart({ headquarters, branchOffices, wayPoints }) {
            // 注册地图
            this.$echarts.registerMap('china', china)

            let option = {
                // 图例
                legend: {
                    orient: 'vertical',
                    left: '10%',
                    bottom: '10%',
                    data: ['总部', '分公司', '工作地点'],
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 16
                    }
                },
                // 提示浮窗样式
                tooltip: {
                    show: false,
                    trigger: 'item',
                    alwaysShowContent: false,
                    backgroundColor: '#2F3144',
                    borderColor: '#1687ad',
                    hideDelay: 100,
                    triggerOn: 'mousemove',
                    // enterable: true,
                    textStyle: {
                        color: '#DADADA',
                        fontSize: '16',
                        width: 20,
                        height: 30,
                        overflow: 'break'
                    },
                    showDelay: 100
                },
                geo: {
                    // 地理坐标系组件,支持在地理坐标系上绘制散点图、线图
                    map: 'china',
                    aspectScale: 0.75,
                    zoom: 1.1,
                    itemStyle: {
                        borderColor: '#1BACD8',
                        borderWidth: 4
                        // shadowColor: "#1687ad",
                        // shadowOffsetX: -3,
                        // shadowOffsetY: 3,
                        // shadowBlur: 4,
                    }
                },
                series: [
                    {
                        type: 'map',
                        map: 'china',
                        tooltip: {
                            show: false
                        },
                        // 取消点击默认样式设置
                        selectedMode: false,
                        // 地图区域的样式设置
                        itemStyle: {
                            normal: {
                                borderColor: '#149CDC',
                                borderWidth: 1,
                                areaColor: {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.8,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: '#01031B' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#01031B' // 100% 处的颜色
                                        }
                                    ],
                                    globalCoord: false // 缺省为 false
                                }
                            },
                            // 鼠标放上去高亮的样式
                            emphasis: {
                                areaColor: '#1687ad',
                                borderWidth: 0
                            }
                        },
                        label: {
                            // 通常状态下的样式
                            normal: {
                                show: false,
                                textStyle: {
                                    color: 'white'
                                }
                            },
                            // 鼠标放上去的样式
                            emphasis: {
                                textStyle: {
                                    color: 'white'
                                }
                            }
                        },
                        zoom: 1.1
                    },
                    {
                        name: '总部',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        effectType: 'ripple',
                        showEffectOn: 'render',
                        // 散点样式
                        rippleEffect: {
                            period: 1,
                            scale: 2,
                            brushType: 'fill'
                        },
                        // 散点大小
                        symbolSize: 8,
                        hoverAnimation: true,
                        // 标志的样式
                        itemStyle: {
                            color: '#FF0000',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        },
                        label: {
                            // 通常状态下的样式
                            normal: {
                                position: 'bottom',
                                show: true,
                                textStyle: {
                                    color: 'white',
                                    fontSize: 16
                                },
                                formatter(value) {
                                    return `${value.data.name}`
                                }
                            }
                        },
                        // 这里渲染标志里的内容以及样式
                        tooltip: {
                            show: true,
                            formatter(value) {
                                return `总部：${value.data.name}</br>
                  总人数：<span style="color:#44E2F4;font-size: 16px">${value.data.midle.totalNumber}人</span></br>
                  男：<span style="color:#44E2F4;font-size: 16px">${value.data.midle.malePercent}%</span></br>
                  女：<span style="color:#44E2F4;font-size: 16px">${value.data.midle.femalePercent}%</span>`
                            },
                            color: '#fff'
                        },
                        zlevel: 1,
                        data: headquarters
                    },
                    {
                        name: '工作地点',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        effectType: 'ripple',
                        showEffectOn: 'render',
                        // 散点样式
                        rippleEffect: {
                            period: 1,
                            scale: 2,
                            brushType: 'fill'
                        },
                        // 散点大小
                        symbolSize: 8,
                        hoverAnimation: true,
                        // 标志的样式
                        itemStyle: {
                            normal: {
                                color: {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.8,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: '#F7BB00' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#FEA90F' // 100% 处的颜色
                                        }
                                    ]
                                },
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 1,
                        tooltip: {
                            show: true,
                            formatter(value) {
                                return `工作地点：${value.data.name}</br>
                  总人数：<span style="color:#44E2F4">${value.data.midle.totalNumber}人</span></br>
                  男：<span style="color:#44E2F4">${value.data.midle.malePercent}%</span></br>
                  女：<span style="color:#44E2F4">${value.data.midle.femalePercent}%</span>`
                            },
                            color: '#fff'
                        },
                        data: wayPoints
                    },
                    {
                        name: '分公司',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        effectType: 'ripple',
                        showEffectOn: 'render',
                        // 散点样式
                        rippleEffect: {
                            number: 0,
                            period: 1,
                            scale: 2,
                            brushType: 'fill'
                        },
                        // 散点大小
                        symbolSize: 10,
                        hoverAnimation: true,
                        // 标志的样式
                        itemStyle: {
                            color: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#0CD0DF' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#149CDC' // 100% 处的颜色
                                    }
                                ]
                            },
                            shadowBlur: 10,
                            shadowColor: '#333'
                        },
                        label: {
                            // 通常状态下的样式
                            normal: {
                                position: 'top',
                                show: true,
                                textStyle: {
                                    color: 'white',
                                    fontSize: 16
                                },
                                formatter(value) {
                                    return `${value.data.name}`
                                }
                            }
                        },
                        tooltip: {
                            show: true,
                            formatter(value) {
                                return `分公司：${value.data.name}</br>
                  总人数：<span style="color:#44E2F4">${value.data.midle.totalNumber}人</span></br>
                  男：<span style="color:#44E2F4">${value.data.midle.malePercent}%</span></br>
                  女：<span style="color:#44E2F4">${value.data.midle.femalePercent}%</span>`
                            },
                            color: '#fff'
                        },
                        data: branchOffices
                    }
                ]
            }
            this.chart.setOption(option)
            // echarts图表渲染一进来默认显示tooltip
            this.chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 1,
                dataIndex: option.series[1].data.length - 1
            })
            let myChart = this.chart
            // 触发其他tooltip放开重置默认
            myChart.on('globalout', params => {
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 1,
                    dataIndex: option.series[1].data.length - 1
                })
            })
        }
    }
}
</script>
