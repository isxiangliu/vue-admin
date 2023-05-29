<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import Chart from '@/mixin/chart'

export default {
    mixins: [Chart],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '95%'
        },
        height: {
            type: String,
            default: '100%'
        },
        // 父组件传递过来的图表数据
        chartData: {
            type: [Object, Array],
            required: true
        }
    },
    data() {
        return {}
    },
    watch: {
        /* 如果图表数据是后台获取的，监听父组件中的数据变化，重新触发Echarts */
        chartData: {
            handler(val) {
                this.setOptions(val)
            },
            deep: true
        }
    },
    mounted() {
        /* 图表初始化 */
        this.initChart(this.$el, 'custom-theme')
        this.showChartLoading()
        console.log(this.chart, '11')
    },
    methods: {
        setOptions(data) {
            this.hiddenChartLoading()
            if (!data || data.length === 0) {
                this.setEmptyOption()
                return
            }
            this.chart.clear()
            this.chart.setOption({
                title: {
                    text: '平均年龄',
                    subtext: `${data.average}岁`,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: '#4C5C82',
                        fontSize: 14,
                        lineHeight: 15,
                        marginTop: -10
                    },
                    subtextStyle: {
                        color: '#4C5C82',
                        fontSize: 18,
                        lineHeight: 20
                    }
                },
                tooltip: {
                    trigger: 'item',
                    valueFormatter: value => value + '人'
                },
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    right: -10
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['30%', '60%'],
                        //   right:70,
                        avoidLabelOverlap: true,
                        label: {
                            show: true,
                            formatter: params => {
                                if (!isNaN(params.percent)) {
                                    return `${params.name}${params.value}人\n${params.percent}%`
                                } else {
                                    return `${params.name}\n${params.value}人`
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        },
                        data: data.list
                    }
                ]
            })
        }
    }
}
</script>
