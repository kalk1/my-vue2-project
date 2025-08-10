<template>
  <div class="composite-chart-container">
    <!-- 缩略图容器 -->
    <div ref="thumbnailChart" class="thumbnail-chart"></div>

    <!-- 主图表容器 -->
    <div ref="mainChart" class="main-chart"></div>
  </div>
</template>

<script>
// 完整引入 ECharts
import * as echarts from "echarts";
// 引入 lodash 的深拷贝方法，防止修改缩略图配置时影响主图
import { cloneDeep } from "lodash";

export default {
  name: "NormalDistributionChart",
  data() {
    return {
      mainChart: null,
      thumbnailChart: null, // 【新增】用于缩略图的 ECharts 实例
      // ---- 可配置的图表参数 ----
      mean: 100,
      stdDev: 15,
      lowerLimit: 70,
      upperLimit: 130,
      target: 100,
      dataCount: 10000,
      barCount: 50,
      // --------------------------
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    // 【修改点】销毁两个图表实例
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
    // 数据生成逻辑保持不变
    generateChartData() {
      const samples = [];
      for (let i = 0; i < this.dataCount; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        samples.push(z * this.stdDev + this.mean);
      }
      const minX = this.mean - 4 * this.stdDev;
      const maxX = this.mean + 4 * this.stdDev;
      const binWidth = (maxX - minX) / this.barCount;
      const bins = new Array(this.barCount).fill(0);
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

    /**
     * 【新增】获取 ECharts 基础配置的函数
     * @param {object} chartData - 图表数据
     * @returns {object} ECharts 配置对象
     */
    getBaseOption(chartData) {
      const { barData, lineData, minX, maxX } = chartData;
      return {
        title: {
          text: "正态分布图",
          subtext: `柱状图: μ = ${this.mean}, σ = ${this.stdDev}`,
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
                  xAxis: this.lowerLimit,
                  lineStyle: { color: "#6ACC29" },
                },
                {
                  name: "目标",
                  xAxis: this.target,
                  lineStyle: { color: "#F8A51D" },
                },
                {
                  name: "上限",
                  xAxis: this.upperLimit,
                  lineStyle: { color: "#FB4D3D" },
                },
              ],
            },
          },
        ],
      };
    },

    /**
     * 【重构】初始化图表的方法
     */
    initChart() {
      // 1. 生成一份通用的图表数据
      const chartData = this.generateChartData();

      // 2. 获取主图表的完整配置
      const mainOption = this.getBaseOption(chartData);

      // 3. 【新增】为缩略图创建一份独立的、极简的配置
      const thumbnailOption = this.createThumbnailOption(mainOption);

      // 4. 初始化两个 ECharts 实例
      this.mainChart = echarts.init(this.$refs.mainChart);
      this.thumbnailChart = echarts.init(this.$refs.thumbnailChart);

      // 5. 为各自的实例设置配置
      this.mainChart.setOption(mainOption);
      this.thumbnailChart.setOption(thumbnailOption);
    },

    /**
     * 【新增】根据主图配置创建缩略图的配置
     * @param {object} mainOption - 主图表的配置
     * @returns {object} - 缩略图的配置
     */
    createThumbnailOption(mainOption) {
      // 使用深拷贝，确保修改缩略图配置不影响主图
      const option = cloneDeep(mainOption);

      // 移除所有非必要的视觉元素
      option.title = null;
      option.legend = null;
      option.tooltip = { show: false };

      // 隐藏坐标轴的所有相关显示
      option.xAxis.show = false;
      option.yAxis.show = false;

      // 移除标线
      if (option.series && option.series[1]) {
        option.series[1].markLine = null;
      }

      // 调整边距，让图形充满容器
      option.grid = {
        top: "5%",
        bottom: "5%",
        left: "5%",
        right: "5%",
      };

      return option;
    },

    /**
     * 【修改点】调整窗口大小时，重置两个图表
     */
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
/* 【新增】整体容器样式 */
.composite-chart-container {
  position: relative;
  width: 100%;
  height: 500px; /* 您可以根据需要调整高度 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

/* 【新增】主图表样式 */
.main-chart {
  width: 600px;
  height: 300px;
}

/* 【新增】缩略图样式 */
.thumbnail-chart {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 200px; /* 缩略图宽度 */
  height: 120px; /* 缩略图高度 */
  border: 1px solid #ccc;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10; /* 确保在主图表上方 */
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
