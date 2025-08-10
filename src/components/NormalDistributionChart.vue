<template>
  <div class="chart-container">
    <div ref="chart" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script>
// 完整引入 ECharts
import * as echarts from "echarts";

export default {
  name: "NormalDistributionChart",
  data() {
    return {
      chart: null,
      // ---- 可配置的图表参数 ----
      mean: 100, // 均值 (μ) - 用于生成柱状图
      stdDev: 15, // 标准差 (σ) - 用于生成柱状图
      lowerLimit: 70, // 下限值
      upperLimit: 130, // 上限值
      target: 100, // 目标值
      dataCount: 10000, // 用于生成柱状图的模拟数据点数量
      barCount: 50, // 柱状图的柱子数量
      // --------------------------
    };
  },
  mounted() {
    // DOM加载完成后初始化图表
    this.$nextTick(() => {
      this.initChart();
    });
    // 添加窗口大小调整事件监听器，以便图表自适应
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // 组件销毁前移除监听器并销毁图表实例，防止内存泄漏
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    /**
     * 正态分布概率密度函数 (PDF)
     * 仅用于生成柱状图的模拟数据
     * @param {number} x - x轴上的值
     * @param {number} mean - 均值 (μ)
     * @param {number} stdDev - 标准差 (σ)
     * @returns {number} - 概率密度值
     */
    normalPDF(x, mean, stdDev) {
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
      return coefficient * Math.exp(exponent);
    },

    /**
     * 生成图表所需的数据
     * @returns {{barData: [number, number][], lineData: [number, number][], minX: number, maxX: number}}
     */
    generateChartData() {
      // ---- 1. 生成柱状图数据 (模拟数据直方图) ----
      const samples = [];
      for (let i = 0; i < this.dataCount; i++) {
        // 使用Box-Muller变换从均匀分布生成正态分布的随机数
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

      const barData = bins.map((count, i) => {
        const xValue = minX + (i + 0.5) * binWidth;
        return [xValue, count];
      });

      // ---- 2. 生成独立的平滑曲线数据 (不再与柱状图关联) ----
      // 您可以在这里替换成您自己的任意数据源
      const lineData = [];
      const step = (maxX - minX) / 200;
      const maxBarHeight = Math.max(...barData.map((item) => item[1])); // 仅用于参考高度
      for (let x = minX; x <= maxX; x += step) {
        // 使用一个简单的数学函数（例如正弦波）来生成数据
        // 调整振幅和频率使其在图表上可见
        const yValue =
          Math.sin(((x - minX) / (maxX - minX)) * Math.PI * 4) *
            (maxBarHeight / 3) +
          maxBarHeight / 2.5;
        lineData.push([x, yValue]);
      }

      return { barData, lineData, minX, maxX };
    },

    /**
     * 初始化ECharts实例并设置配置项
     */
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "default");
      const { barData, lineData, minX, maxX } = this.generateChartData();

      const option = {
        title: {
          text: "正态分布图",
          subtext: `柱状图: μ = ${this.mean}, σ = ${this.stdDev}`,
          left: "center",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: (params) => {
            const point = params[0];
            if (!point) return "";
            // 【修复点】使用 point.axisValue (数值) 而不是 point.axisValueLabel (字符串)
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
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
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
            lineStyle: {
              color: "#d48265",
              width: 3,
            },
            markLine: {
              symbol: ["none", "arrow"],
              label: {
                formatter: "{b}: {c}",
                position: "insideEndTop",
                fontSize: 14,
              },
              lineStyle: {
                type: "dashed",
                width: 2,
              },
              emphasis: {
                disabled: true,
              },
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

      this.chart.setOption(option);
    },

    /**
     * 处理窗口大小变化，重新渲染图表
     */
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style scoped>
.chart-container {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}
</style>
