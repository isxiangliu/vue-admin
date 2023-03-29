<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import Chart from '@/mixin/chart';

export default {
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '95%',
    },
    height: {
      type: String,
      default: '100%',
    },
    // 父组件传递过来的图表数据
    chartData: {
      type: Object,
      required: true,
    },
  },
  mixins: [Chart],
  data() {
    return {};
  },
  watch: {
    /* 如果图表数据是后台获取的，监听父组件中的数据变化，重新触发Echarts */
    chartData: {
      handler(val) {
        this.setOptions(val);
      },
      deep: true
    },
  },
  mounted() {
    /* 图表初始化 */
    this.initChart(this.$el, 'custom-theme');
    this.showChartLoading();
  },
  methods: {
    setOptions({ department, data } = {}) {
      this.hiddenChartLoading();
      if (!data || data.length === 0) {
        this.setEmptyOption();
        return;
      }
      this.chart.clear();
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          valueFormatter: (value) => value + '人',
        },
        xAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'category',
            data: department,
            inverse: true,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        series: [
          {
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            label: {
              show: true,
              position: 'right',
              color: '#94AED9',
            },
            emphasis: {
              focus: 'series',
            },
            itemStyle: {
              //隔柱换色，
              color: function (params) {
                //首先定义一个数组
                var colorList = ['#4764D6', '#BDE7F0'];
                if (params.dataIndex % 2 == 0) {
                  return colorList[0];
                } else {
                  return colorList[1];
                }
              },
            },
            data: data,
          },
        ],
        dataZoom: [
          {
            type: 'slider',
            show: true, //隐藏或显示（true）组件
            width: 20,
            showDetail: false, //是否显示detail，即拖拽时候显示详细数值信息
            startValue: 0, // 数据窗口范围的起始数值
            endValue: 5, // 数据窗口范围的结束数值（一页显示多少条数据）
            yAxisIndex: [0, 1], //控制哪个轴，如果是 number 表示控制一个轴，如果是 Array 表示控制多个轴。此处控制第二根轴
          },
          {
            //没有下面这块的话，只能拖动滚动条，鼠标滚轮在区域内不能控制外部滚动条
            type: 'inside',
            width: 20,
            yAxisIndex: [0, 1], //控制哪个轴，如果是 number 表示控制一个轴，如果是 Array 表示控制多个轴。此处控制第二根轴
            zoomOnMouseWheel: false, //滚轮是否触发缩放
            moveOnMouseMove: true, //鼠标移动能否触发平移
            moveOnMouseWheel: true, //鼠标滚轮能否触发平移
          },
        ],
        //全屏
        // toolbox: {
        //   feature: {
        //     dataZoom: { yAxisIndex: 'none' }, // 数据区域缩放
        //     restore: { show: true }, // 重置
        //     saveAsImage: { show: true }, // 导出图片
        //     myFull: {
        //       // 全屏
        //       show: true,
        //       title: '全屏',
        //       icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
        //       onclick: (e) => {
        //         // 全屏查看
        //         if (this.$el.requestFullScreen) {
        //           // HTML W3C 提议
        //           this.$el.requestFullScreen();
        //         } else if (this.$el.msRequestFullscreen) {
        //           // IE11
        //           this.$el.msRequestFullScreen();
        //         } else if (this.$el.webkitRequestFullScreen) {
        //           // Webkit
        //           this.$el.webkitRequestFullScreen();
        //         } else if (this.$el.mozRequestFullScreen) {
        //           // Firefox
        //           this.$el.mozRequestFullScreen();
        //         }
        //         // 退出全屏
        //         if (this.$el.requestFullScreen) {
        //           document.exitFullscreen();
        //         } else if (this.$el.msRequestFullScreen) {
        //           document.msExitFullscreen();
        //         } else if (this.$el.webkitRequestFullScreen) {
        //           document.webkitCancelFullScreen();
        //         } else if (this.$el.mozRequestFullScreen) {
        //           document.mozCancelFullScreen();
        //         }
        //       },
        //     },
        //   },
        // },
      });
    },
  },
};
</script>
