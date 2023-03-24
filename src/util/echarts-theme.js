//图表统一配置文件
export default {
  "color": [
    "#5B8FF9",
    "#9DE3F2",
    "#0796F0",
    "#74BE8C",
    "#F7BF57",
    "#F368F3",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ],
  "backgroundColor": "rgba(0, 0, 0, 0)",
  "textStyle": {},
  "title": {
    // 主标题文字颜色
    "textStyle": {
      "color": "#4c5c82"
    },
    // 副标题文字颜色
    "subtextStyle": {
      "color": "#4c5c82"
    }
  },
  "grid": {
    "top": 40,
    "left": 20,
    "right": 20,
    "bottom": 0,
    "containLabel": true
  },
  // 折线图
  "line": {
    "itemStyle": {
      "borderWidth": 1,
    },
    "lineStyle": {
      "width": 2,
    },
    "label": {
      "color": "#4365DC"
    },
    "symbolSize": 5,
    "symbol": "emptyCircle",// 标记图形为空心圆
    "smooth": false
  },
  // 雷达图
  "radar": {
    "itemStyle": {
      "borderWidth": 1
    },
    "lineStyle": {
      "width": 2
    },
    "symbolSize": 4,
    "symbol": "emptyCircle",
    "smooth": false
  },
  // 柱状图
  "bar": {
    "itemStyle": {
      "barBorderWidth": "0",
      "barBorderColor": "#ccc"
    },
    "label": {
      "show": true,
      "color": "#4C5C82",
      "position": "top"
    }
  },
  // 饼图
  "pie": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    },
    "label": {
      "color": "#4C5C82",
      "overflow": "break",// 标签换行显示(确保能显示完全)
    },
    "emptyCircleStyle": {// 占位圆样式
      "color": "#fff"
    }
  },
  "scatter": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    }
  },
  "boxplot": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    }
  },
  "parallel": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    }
  },
  "sankey": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    }
  },
  "funnel": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    }
  },
  "gauge": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    },
  },
  "candlestick": {
    "itemStyle": {
      "color": "#eb5454",
      "color0": "#47b262",
      "borderColor": "#eb5454",
      "borderColor0": "#47b262",
      "borderWidth": 1
    }
  },
  "graph": {
    "itemStyle": {
      "borderWidth": "0",
      "borderColor": "#ccc"
    },
    "lineStyle": {
      "width": 1,
      "color": "#aaa"
    },
    "symbolSize": 4,
    "symbol": "emptyCircle",
    "smooth": false,
    "color": [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
    ],
    "label": {
      "color": "#4c5c82"
    }
  },
  "map": {
    "itemStyle": {
      "areaColor": "#eee",
      "borderColor": "#444",
      "borderWidth": 0.5
    },
    "label": {
      "color": "#000"
    },
    "emphasis": {
      "itemStyle": {
        "areaColor": "rgba(255,215,0,0.8)",
        "borderColor": "#444",
        "borderWidth": 1
      },
      "label": {
        "color": "rgb(100,0,0)"
      }
    }
  },
  "geo": {
    "itemStyle": {
      "areaColor": "#eee",
      "borderColor": "#444",
      "borderWidth": 0.5
    },
    "label": {
      "color": "#000"
    },
    "emphasis": {
      "itemStyle": {
        "areaColor": "rgba(255,215,0,0.8)",
        "borderColor": "#444",
        "borderWidth": 1
      },
      "label": {
        "color": "rgb(100,0,0)"
      }
    }
  },
  // 类目轴
  "categoryAxis": {
    "axisLine": {
      "show": false,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "red"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#94aed9",
      "fontSize": 14,
      "lineHeight": 20,
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": [
          "#E0E6F1"
        ]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  // 数值轴
  "valueAxis": {
    "nameTextStyle": {
      "color": "#94aed9",
      "fontSize": 14,
      "lineHeight": 20,
    },
    "axisLine": {
      "show": false,// 不显示坐标轴轴线
      "lineStyle": {
        "color": "#94aed9",
        "opacity": 0.2
      }
    },
    "axisTick": {
      "show": false,// 不显示坐标轴刻度
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#94aed9",
      "fontSize": 14,
      "lineHeight": 20
    },
    // 分隔线
    "splitLine": {
      "show": true,// 显示坐标轴在gird区域中的分隔线
      "lineStyle": {
        "color": [
          "#94aed9"
        ],
        "opacity": 0.2
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  // 对数轴
  "logAxis": {
    "axisLine": {
      "show": false,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#6E7079"
    },
    "splitLine": {
      "show": true,
      "lineStyle": {
        "color": [
          "#E0E6F1"
        ]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  // 时间轴
  "timeAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisTick": {
      "show": true,
      "lineStyle": {
        "color": "#6E7079"
      }
    },
    "axisLabel": {
      "show": true,
      "color": "#6E7079"
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": [
          "#E0E6F1"
        ]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": [
          "rgba(250,250,250,0.2)",
          "rgba(210,219,238,0.2)"
        ]
      }
    }
  },
  "toolbox": {
    "iconStyle": {
      "borderColor": "#999"
    },
    "emphasis": {
      "iconStyle": {
        "borderColor": "#666"
      }
    }
  },
  // 图例
  "legend": {
    // 文字颜色
    "textStyle": {
      "color": "#94aed9"
    },
    // 图例列表布局
    "orient": "horizontal",
    // 图例图形宽度
    "itemWidth": 14,
    // 图例图形高度
    "itemHeight": 14,
  },
  "tooltip": {
    "axisPointer": {
      "lineStyle": {
        "color": "#ccc",
        "width": 1
      },
      "crossStyle": {
        "color": "#ccc",
        "width": 1
      }
    }
  },
  "timeline": {
    "lineStyle": {
      "color": "#DAE1F5",
      "width": 2
    },
    "itemStyle": {
      "color": "#A4B1D7",
      "borderWidth": 1
    },
    "controlStyle": {
      "color": "#A4B1D7",
      "borderColor": "#A4B1D7",
      "borderWidth": 1
    },
    "checkpointStyle": {
      "color": "#316bf3",
      "borderColor": "fff"
    },
    "label": {
      "color": "#A4B1D7"
    },
    "emphasis": {
      "itemStyle": {
        "color": "#FFF"
      },
      "controlStyle": {
        "color": "#A4B1D7",
        "borderColor": "#A4B1D7",
        "borderWidth": 1
      },
      "label": {
        "color": "#A4B1D7"
      }
    }
  },
  "visualMap": {
    "color": [
      "#bf444c",
      "#d88273",
      "#f6efa6"
    ]
  },
  "dataZoom": {
    "handleSize": "undefined%",
    "textStyle": {}
  },
  "markPoint": {
    "label": {
      "color": "#4c5c82"
    },
    "emphasis": {
      "label": {
        "color": "#4c5c82"
      }
    }
  }
}
