<template>
  <div ref="chart" class="k-line-chart-pro"></div>
</template>

<script>
// 完整引入 ECharts
import * as echarts from "echarts";

export default {
  name: "KLineChartPro",
  data() {
    return {
      chart: null,
      // 1. 根据图片走势重新生成的模拟数据 [开盘, 收盘, 最低, 最高]
      rawData: [
        [17420, 17460, 17380, 17480],
        [17465, 17510, 17450, 17530],
        [17512, 17660, 17500, 17680],
        [17665, 17700, 17650, 17730],
        [17705, 17720, 17680, 17750],
        [17710, 17650, 17630, 17740],
        [17640, 17720, 17630, 17750],
        [17730, 17790, 17720, 17820],
        [17800, 17940, 17790, 17960],
        [17945, 17990, 17920, 18020],
        [17995, 18070, 17980, 18090],
        [18075, 18130, 18060, 18160],
        [18120, 18070, 18050, 18140],
        [18080, 18010, 17970, 18110],
        [18010, 17870, 17850, 18030],
        [17860, 17820, 17800, 17900],
        [17830, 17890, 17810, 17920],
        [17880, 17740, 17730, 17900],
        [17730, 17670, 17650, 17780],
        [17680, 17790, 17670, 17810],
        [17800, 17890, 17780, 17910],
        [17880, 17840, 17820, 17930],
        [17850, 17710, 17700, 17870],
        [17720, 17680, 17640, 17760],
        [17690, 17400, 17370, 17700],
        [17410, 17530, 17390, 17560],
        [17520, 17470, 17440, 17570],
        [17480, 17660, 17460, 17690],
        [17670, 17790, 17650, 17810],
        [17780, 17810, 17740, 17860],
        [17820, 17740, 17720, 17850],
        [17750, 17770, 17730, 17800],
        [17760, 17960, 17750, 17990],
        [17950, 18010, 17930, 18040],
        [18000, 17970, 17940, 18030],
        [17980, 17840, 17830, 18000],
        [17850, 17830, 17810, 17900],
        [17820, 17770, 17740, 17860],
        [17780, 17730, 17710, 17820],
        [17720, 17710, 17660, 17760],
        [17700, 17690, 17630, 17740],
        [17680, 17700, 17650, 17720],
        [17700, 17660, 17630, 17710],
        [17650, 17710, 17620, 17740],
        [17710, 17700, 17650, 17750],
        [17700, 17730, 17680, 17770],
        [17740, 17790, 17720, 17810],
        [17780, 17860, 17770, 17890],
        [17870, 17760, 17740, 17890],
      ],
      dates: [
        "2016-03-24",
        "2016-03-25",
        "2016-03-28",
        "2016-03-29",
        "2016-03-30",
        "2016-03-31",
        "2016-04-01",
        "2016-04-04",
        "2016-04-05",
        "2016-04-06",
        "2016-04-07",
        "2016-04-11",
        "2016-04-12",
        "2016-04-13",
        "2016-04-14",
        "2016-04-15",
        "2016-04-18",
        "2016-04-19",
        "2016-04-20",
        "2016-04-21",
        "2016-04-22",
        "2016-04-25",
        "2016-04-26",
        "2016-04-27",
        "2016-05-06",
        "2016-05-09",
        "2016-05-10",
        "2016-05-11",
        "2016-05-12",
        "2016-05-13",
        "2016-05-16",
        "2016-05-17",
        "2016-05-18",
        "2016-05-19",
        "2016-05-20",
        "2016-05-23",
        "2016-05-24",
        "2016-05-25",
        "2016-05-26",
        "2016-05-27",
        "2016-06-01",
        "2016-06-02",
        "2016-06-03",
        "2016-06-06",
        "2016-06-07",
        "2016-06-08",
        "2016-06-13",
        "2016-06-14",
        "2016-06-15",
        "2016-06-16",
        "2016-06-20",
      ],
    };
  },
  mounted() {
    // 延迟初始化，确保DOM完全加载
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    calculateMA(dayCount, data) {
      var result = [];
      for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount - 1) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += +data[i - j][1]; // 按收盘价计算
        }
        result.push(sum / dayCount);
      }
      return result;
    },

    initChart() {
      this.chart = echarts.init(this.$refs.chart, null, { renderer: "svg" }); // 使用SVG渲染更清晰

      const upColor = "#00da3c"; // 绿色-涨
      const downColor = "#ec0000"; // 红色-跌

      // 准备MA数据
      const ma5 = this.calculateMA(5, this.rawData);
      const ma10 = this.calculateMA(10, this.rawData);
      const ma20 = this.calculateMA(20, this.rawData);
      const ma30 = this.calculateMA(30, this.rawData);

      const option = {
        backgroundColor: "#f8f8ff",
        // 为了1:1还原，不设置title和legend
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          // 自定义tooltip，使其更像金融图表
          formatter: (params) => {
            let candlestickParam = params.find(
              (p) => p.seriesType === "candlestick"
            );
            if (!candlestickParam) return;
            const data = candlestickParam.data; // [open, close, low, high]
            const date = candlestickParam.name;
            let html = `${date}<br/>`;
            html += `开1111盘: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[0].toFixed(2)}</span><br/>`;
            html += `收盘: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[1].toFixed(2)}</span><br/>`;
            html += `最低: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[2].toFixed(2)}</span><br/>`;
            html += `最高: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[3].toFixed(2)}</span><br/>`;

            params.forEach((param) => {
              if (
                param.seriesType === "line" &&
                param.value !== undefined &&
                param.value !== "-"
              ) {
                html += `${param.seriesName}: <span style="color: ${
                  param.color
                };">${Number(param.value).toFixed(2)}</span><br/>`;
              }
            });

            return html;
          },
        },
        grid: {
          left: 60,
          right: 40,
          top: 20,
          bottom: 40,
        },
        xAxis: {
          type: "category",
          data: this.dates,
          axisLine: {
            show: true,
            lineStyle: { color: "#d0d0d0" },
          },
          axisTick: { show: false },
          axisLabel: {
            color: "#888888",
            fontSize: 10,
          },
          splitLine: { show: false },
        },
        yAxis: {
          type: "value",
          scale: true,
          position: "right",
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#888888",
            fontSize: 10,
            inside: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f0f0f0",
              type: "solid",
              width: 0.5,
            },
          },
        },
        // 为了1:1还原，移除dataZoom滑块
        // dataZoom: [...],
        series: [
          {
            name: "K线",
            type: "candlestick",
            data: this.rawData,
            // 3. 修正：调整K线颜色和样式
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upColor,
              borderColor0: downColor,
              // 影线（上下影线）宽度
              borderWidth: 1,
            },
          },
          // MA5: 蓝色实线
          {
            name: "MA5",
            type: "line",
            data: ma5,
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#6CB2FF",
              width: 1.2,
            },
          },
          // MA10: 黄色圆点线
          {
            name: "MA10",
            type: "line",
            data: ma10,
            smooth: true,
            symbol: "circle",
            symbolSize: 3,
            itemStyle: {
              color: "#FFD700",
            },
            lineStyle: {
              color: "#FFD700",
              width: 1,
            },
          },
          // MA20: 紫色虚线
          {
            name: "MA20",
            type: "line",
            data: ma20,
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#9966CC",
              width: 1.2,
              type: "dashed",
            },
          },
          // MA30: 橙色虚线
          {
            name: "MA30",
            type: "line",
            data: ma30,
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#FF9500",
              width: 1.2,
              type: "dashed",
            },
          },
        ],
      };

      this.chart.setOption(option);
      window.addEventListener("resize", this.resizeChart);
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style scoped>
.k-line-chart-pro {
  width: 100%;
  height: 500px;
  background-color: #f8f8ff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
