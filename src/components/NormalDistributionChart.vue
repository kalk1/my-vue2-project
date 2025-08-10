<template>
  <div class="composite-chart-container">
    <!-- 缩略图容器 -->
    <div ref="thumbnailChart" class="thumbnail-chart"></div>

    <!-- 主图表容器 -->
    <div ref="mainChart" class="main-chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { cloneDeep } from "lodash";

export default {
  name: "NormalDistributionChart",
  props: {
    chartConfig: {
      type: Object,
      required: true,
      default: () => ({
        title: "正态分布图",
        mean: 100,
        stdDev: 15,
        lowerLimit: 70,
        upperLimit: 130,
        target: 100,
        dataCount: 10000,
        barCount: 50,
      }),
    },
  },
  data() {
    return {
      mainChart: null,
      thumbnailChart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // 移除事件监听，销毁实例
    window.removeEventListener("resize", this.handleResize);
    if (this.mainChart) {
      this.mainChart.dispose();
      this.mainChart = null;
    }
    if (this.thumbnailChart) {
      this.thumbnailChart.dispose();
      this.thumbnailChart = null;
    }
  },
  methods: {
    // 【修改点】initChart 现在会判断使用传入数据还是生成数据
    initChart() {
      let chartData;

      // 检查 props 中是否直接传入了有效的图表数据
      if (
        Array.isArray(this.chartConfig.barData) &&
        this.chartConfig.barData.length > 0
      ) {
        // 如果有，直接使用传入的数据
        const allX = [
          ...(this.chartConfig.barData || []).map((p) => p[0]),
          ...(this.chartConfig.lineData || []).map((p) => p[0]),
        ];
        chartData = {
          barData: this.chartConfig.barData,
          lineData: this.chartConfig.lineData || [], // 曲线数据可以是可选的
          minX: allX.length > 0 ? Math.min(...allX) : 0,
          maxX: allX.length > 0 ? Math.max(...allX) : 100,
        };
      } else {
        // 如果没有，则像以前一样根据统计参数生成数据
        chartData = this.generateChartDataFromParams();
      }

      const mainOption = this.getBaseOption(chartData);
      const thumbnailOption = this.createThumbnailOption(mainOption);

      this.mainChart = echarts.init(this.$refs.mainChart);
      this.thumbnailChart = echarts.init(this.$refs.thumbnailChart);

      this.mainChart.setOption(mainOption);
      this.thumbnailChart.setOption(thumbnailOption);
    },

    // 根据统计参数生成数据的函数（原 generateChartData）
    generateChartDataFromParams() {
      const { mean, stdDev, dataCount, barCount } = this.chartConfig;
      const samples = [];
      for (let i = 0; i < dataCount; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        samples.push(z * stdDev + mean);
      }
      const minX = mean - 4 * stdDev;
      const maxX = mean + 4 * stdDev;
      const binWidth = (maxX - minX) / barCount;
      const bins = new Array(barCount).fill(0);
      samples.forEach((sample) => {
        if (sample >= minX && sample < maxX) {
          const binIndex = Math.floor((sample - minX) / binWidth);
          bins[binIndex]++;
        }
      });
      const barData = bins.map((count, i) => [
        minX + (i + 0.5) * binWidth,
        count,
      ]);
      const lineData = [];
      const step = (maxX - minX) / 200;
      const maxBarHeight = Math.max(...barData.map((item) => item[1]));
      for (let x = minX; x <= maxX; x += step) {
        const yValue =
          Math.sin(((x - minX) / (maxX - minX)) * Math.PI * 4) *
            (maxBarHeight / 3) +
          maxBarHeight / 2.5;
        lineData.push([x, yValue]);
      }
      return { barData, lineData, minX, maxX };
    },

    getBaseOption(chartData) {
      const { barData, lineData, minX, maxX } = chartData;
      const { title, mean, stdDev, lowerLimit, target, upperLimit } =
        this.chartConfig;
      return {
        title: {
          text: title,
          subtext: mean && stdDev ? `柱状图: μ = ${mean}, σ = ${stdDev}` : "",
          left: "center",
        },
        grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
          formatter: (params) => {
            const point = params[0];
            if (!point) return "";
            let res = `数值: ${point.axisValue.toFixed(2)}<br/>`;
            params.forEach((p) => {
              res += `${p.marker}${p.seriesName}: ${p.value[1].toFixed(
                2
              )}<br/>`;
            });
            return res;
          },
        },
        legend: {
          data: ["数据分布", "参考曲线"],
          top: "bottom",
          padding: [30, 0, 0, 0],
        },
        xAxis: {
          type: "value",
          name: "数值",
          nameLocation: "middle",
          nameGap: 30,
          min: minX,
          max: maxX,
        },
        yAxis: {
          type: "value",
          name: "频数/数值",
          axisLine: { show: true },
          splitLine: { show: true, lineStyle: { type: "dashed" } },
        },
        series: [
          {
            name: "数据分布",
            type: "bar",
            barWidth: "99%",
            data: barData,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
          },
          {
            name: "参考曲线",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: lineData,
            lineStyle: { color: "#d48265", width: 3 },
            markLine: {
              symbol: ["none", "arrow"],
              label: {
                formatter: "{b}: {c}",
                position: "insideEndTop",
                fontSize: 14,
              },
              lineStyle: { type: "dashed", width: 2 },
              emphasis: { disabled: true },
              data: [
                {
                  name: "下限",
                  xAxis: lowerLimit,
                  lineStyle: { color: "#6ACC29" },
                },
                {
                  name: "目标",
                  xAxis: target,
                  lineStyle: { color: "#F8A51D" },
                },
                {
                  name: "上限",
                  xAxis: upperLimit,
                  lineStyle: { color: "#FB4D3D" },
                },
              ],
            },
          },
        ],
      };
    },

    createThumbnailOption(mainOption) {
      const option = cloneDeep(mainOption);
      option.title = null;
      option.legend = null;
      option.tooltip = { show: false };
      option.xAxis.show = false;
      option.yAxis.show = false;
      if (option.series && option.series[1]) {
        option.series[1].markLine = null;
      }
      option.grid = { top: "5%", bottom: "5%", left: "5%", right: "5%" };
      return option;
    },

    handleResize() {
      if (this.mainChart) {
        this.mainChart.resize();
      }
      if (this.thumbnailChart) {
        this.thumbnailChart.resize();
      }
    },
  },
};
</script>

<style scoped>
.composite-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.main-chart {
  width: 100%;
  height: 100%;
}

.thumbnail-chart {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 200px;
  height: 120px;
  border: 1px solid #ccc;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
