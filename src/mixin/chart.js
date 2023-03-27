import {downloadFile, hiddenChartLoading, showChartLoading} from "@/util/common";
import request from "@/api";

export default {
  data() {
    return {
      chart: null,
    }
  },
  beforeDestroy() {
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.clear();
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    /**
     * @description 初始化chart
     * @author xiangliu
     * @date 2022/12/6 10:05
     * @param dom
     * @param theme
     */
    initChart(dom, theme) {
      if (!this.chart) {
        this.chart = this.$echarts.init(dom, theme);
        console.log(this.chart);
      } else {
        this.chart.clear();
      }
      window.addEventListener("resize", () => {
        if (this.chart) {
          this.chart.resize();
        }
      });
    },
    /**
     * @description 配置暂无数据
     * @author xiangliu
     * @date 2023/2/10 13:53
     * @param chart
     */
    setEmptyOption(chart) {
      if (!chart) {
        chart = this.chart;
      }
      chart.clear();
      chart.setOption({
        title: {
          text: "暂无数据",
          x: "center",
          y: "center",
          textStyle: {
            color: "#909399",
            fontWeight: "normal",
            fontSize: 12,
          }
        }
      })
    },
    /**
     * @description 显示loading
     * @author xiangliu
     * @date 2022/12/6 9:59
     */
    showChartLoading() {
      showChartLoading(this.chart);
    },
    /**
     * @description 隐藏loading
     * @author xiangliu
     * @date 2022/12/6 9:59
     */
    hiddenChartLoading() {
      hiddenChartLoading(this.chart);
    },
    /**
     * @description 导出图表图片
     * @author xiangliu
     * @date 2022/12/20 21:08
     * @param chart echarts实例
     * @param fileName 图片文件名称
     */
    downloadChart(chart, fileName) {
      if (!chart) {
        chart = this.chart;
      }
      if (!chart) {
        return;
      }
      const base64 = chart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      if (!fileName) {
        fileName = new Date().getTime();
      }

      downloadFile(base64, fileName);
    },
    /**
     * @description 导出表格
     * @author xiangliu
     * @date 2022/12/22 15:45
     * @param url 接口url
     * @param params 请求入参
     */
    async downloadTable(url, params) {
      const res = await this.exportTableFile(url, params);
      if (!res) {
        return;
      }
      const {fileStr, excelName} = res;
      downloadFile(`data:application/vnd.ms-excel;base64,${fileStr}`, excelName);
    },
    /**
     * @description 导出表格
     * @author xiangliu
     * @date 2022/12/22 13:58
     * @param url
     * @param params
     */
    exportTableFile(url, params) {
      return request({
        url: `/daas-hr-bi-service${url}`,
        method: "post",
        data: params
      })
    }
  }
}
