<template>
  <div class="process-capability-card">
    <div class="chart-header">
      <h2>{{ title }}</h2>
    </div>

    <div class="charts-wrapper">
      <div class="combined-chart">
        <!-- 图表容器 -->
        <div :ref="chartRef" class="chart-container"></div>

        <!-- 左侧统计面板 -->
        <div class="stats-section left-stats">
          <h3>组内能力指数</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Cp:</span>
              <span class="stat-value">{{
                withinGroupStats.Cp.toFixed(3)
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Cpk:</span>
              <span class="stat-value">{{
                withinGroupStats.Cpk.toFixed(3)
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">CPL:</span>
              <span class="stat-value">{{
                withinGroupStats.CPL.toFixed(3)
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">CPU:</span>
              <span class="stat-value">{{
                withinGroupStats.CPU.toFixed(3)
              }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧统计面板 -->
        <div class="stats-section right-stats">
          <h3>整体能力指数</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Pp:</span>
              <span class="stat-value">{{ overallStats.Pp.toFixed(3) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Ppk:</span>
              <span class="stat-value">{{ overallStats.Ppk.toFixed(3) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">PPL:</span>
              <span class="stat-value">{{ overallStats.PPL.toFixed(3) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">PPU:</span>
              <span class="stat-value">{{ overallStats.PPU.toFixed(3) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import * as ecStat from "echarts-stat";

export default {
  name: "ProcessCapabilityCard",
  props: {
    // 卡片标题
    title: {
      type: String,
      default: "过程能力分析报告",
    },
    // 规格参数
    specParams: {
      type: Object,
      default: () => ({
        lowerLimit: 2.0,
        upperLimit: 8.0,
        target: 5.0,
      }),
    },
    // 数据生成参数
    dataParams: {
      type: Object,
      default: () => ({
        mean: 5.0,
        stdDev: 1.2,
        count: 200,
      }),
    },
    // 卡片ID，用于生成唯一的ref
    cardId: {
      type: [String, Number],
      required: true,
    },
    // 是否显示缩略图
    showThumbnail: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chart: null,
      // 模拟数据 - 实际项目中从后端获取
      sampleData: [],
      // 统计结果
      withinGroupStats: {
        Cp: 0,
        Cpk: 0,
        CPL: 0,
        CPU: 0,
      },
      overallStats: {
        Pp: 0,
        Ppk: 0,
        PPL: 0,
        PPU: 0,
      },
    };
  },
  computed: {
    chartRef() {
      return `chart-${this.cardId}`;
    },
  },
  mounted() {
    this.generateSampleData();
    this.calculateStats();
    this.initCharts();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    // 生成模拟数据
    generateSampleData() {
      const { mean, stdDev, count } = this.dataParams;

      for (let i = 0; i < count; i++) {
        // Box-Muller 变换生成正态分布数据
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 =
          Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const value = mean + z0 * stdDev;
        this.sampleData.push(value);
      }
    },

    // 计算统计指标
    calculateStats() {
      const data = this.sampleData;
      const n = data.length;

      // 计算基本统计量
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance =
        data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
      const stdDev = Math.sqrt(variance);

      // 计算规格参数
      const { lowerLimit, upperLimit } = this.specParams;
      const tolerance = upperLimit - lowerLimit;

      // 计算组内能力指数
      this.withinGroupStats.Cp = tolerance / (6 * stdDev);
      this.withinGroupStats.CPL = (mean - lowerLimit) / (3 * stdDev);
      this.withinGroupStats.CPU = (upperLimit - mean) / (3 * stdDev);
      this.withinGroupStats.Cpk = Math.min(
        this.withinGroupStats.CPL,
        this.withinGroupStats.CPU
      );

      // 计算整体能力指数（假设整体标准差稍大）
      const overallStdDev = stdDev * 1.1;
      this.overallStats.Pp = tolerance / (6 * overallStdDev);
      this.overallStats.PPL = (mean - lowerLimit) / (3 * overallStdDev);
      this.overallStats.PPU = (upperLimit - mean) / (3 * overallStdDev);
      this.overallStats.Ppk = Math.min(
        this.overallStats.PPL,
        this.overallStats.PPU
      );
    },

    // 初始化图表
    initCharts() {
      this.initCombinedChart();
    },

    // 初始化组合图表
    initCombinedChart() {
      this.chart = echarts.init(this.$refs[this.chartRef]);

      // 计算基本统计量
      const mean =
        this.sampleData.reduce((sum, val) => sum + val, 0) /
        this.sampleData.length;
      const variance =
        this.sampleData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        (this.sampleData.length - 1);
      const stdDev = Math.sqrt(variance);

      // 生成缩略图数据（使用较大的binWidth）
      const thumbnailBinWidth = 0.5;
      const thumbnailHistogram = ecStat.histogram(this.sampleData, {
        binWidth: thumbnailBinWidth,
      });

      // 生成主图数据（使用较小的binWidth）
      const mainBinWidth = 0.3;
      const mainHistogram = ecStat.histogram(this.sampleData, {
        binWidth: mainBinWidth,
      });

      // 生成正态分布曲线数据（主图用）
      const min = Math.min(...this.sampleData);
      const max = Math.max(...this.sampleData);
      const step = (max - min) / 100;

      const normalData = [];
      for (let x = min; x <= max; x += step) {
        const pdf =
          (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        const y = this.sampleData.length * mainBinWidth * pdf;
        normalData.push([x, y]);
      }

      // 生成缩略图正态分布曲线数据
      const thumbnailNormalData = [];
      for (let x = min; x <= max; x += step) {
        const pdf =
          (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        const y = this.sampleData.length * thumbnailBinWidth * pdf;
        thumbnailNormalData.push([x, y]);
      }

      const maxBarCount = Math.max.apply(
        null,
        mainHistogram.data.map((p) => p[1])
      );

      const option = {
        title: {
          text: this.title,
          left: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        // legend: {
        //   data: [
        //     "主图分布",
        //     "正态分布曲线",
        //     "平滑虚线",
        //     "规格上限",
        //     "规格下限",
        //     "目标值",
        //   ],
        //   top: 35,
        //   fontSize: 10,
        // },
        grid: this.showThumbnail
          ? [
              {
                // 缩略图网格 - 左上角
                left: "5%",
                top: "0%",
                width: "10%",
                height: "15%",
              },
              {
                // 主图网格 - 中间，为左右统计面板留出空间
                left: "20%",
                top: "15%",
                width: "80%",
                height: "50%",
              },
            ]
          : [
              {
                // 主图网格 - 居中显示，不显示缩略图
                left: "10%",
                top: "15%",
                width: "80%",
                height: "70%",
              },
            ],
        xAxis: this.showThumbnail
          ? [
              {
                // 缩略图X轴
                type: "value",
                gridIndex: 0,
                name: "",
                nameTextStyle: { fontSize: 10 },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
              },
              {
                // 主图X轴
                type: "value",
                gridIndex: 1,
                name: "测量值",
                nameLocation: "middle",
                nameGap: 25,
                axisLabel: { fontSize: 10 },
              },
            ]
          : [
              {
                // 主图X轴（不显示缩略图时）
                type: "value",
                gridIndex: 0,
                name: "测量值",
                nameLocation: "middle",
                nameGap: 25,
                axisLabel: { fontSize: 10 },
              },
            ],
        yAxis: this.showThumbnail
          ? [
              {
                // 缩略图Y轴
                type: "value",
                gridIndex: 0,
                name: "",
                nameTextStyle: { fontSize: 10 },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
              },
              {
                // 主图Y轴
                type: "value",
                gridIndex: 1,
                name: "频次",
                nameLocation: "middle",
                nameGap: 35,
                axisLabel: { fontSize: 10 },
              },
            ]
          : [
              {
                // 主图Y轴（不显示缩略图时）
                type: "value",
                gridIndex: 0,
                name: "频次",
                nameLocation: "middle",
                nameGap: 35,
                axisLabel: { fontSize: 10 },
              },
            ],
        series: this.showThumbnail
          ? [
              {
                // 缩略图柱状图
                name: "缩略图分布",
                type: "bar",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: thumbnailHistogram.data,
                itemStyle: {
                  color: "#91cc75",
                  opacity: 0.7,
                },
                barWidth: "90%",
                silent: true,
              },
              {
                // 缩略图正态分布曲线
                name: "缩略图正态分布",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: thumbnailNormalData,
                smooth: true,
                lineStyle: {
                  color: "#ff6b6b",
                  width: 1,
                },
                symbol: "none",
                silent: true,
              },
              {
                // 缩略图平滑虚线
                name: "缩略图平滑虚线",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: thumbnailNormalData.map((point) => [
                  point[0],
                  point[1] * 0.8,
                ]),
                smooth: true,
                lineStyle: {
                  color: "#fac858",
                  type: "dashed",
                  width: 1,
                },
                symbol: "none",
                silent: true,
              },
              {
                // 主图柱状图
                name: "主图分布",
                type: "bar",
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: mainHistogram.data,
                itemStyle: {
                  color: "#5470c6",
                  opacity: 0.8,
                },
                barWidth: "90%",
              },
              {
                // 正态分布曲线
                name: "正态分布曲线",
                type: "line",
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: normalData,
                smooth: true,
                lineStyle: {
                  color: "#ff6b6b",
                  width: 2,
                },
                symbol: "none",
                z: 3,
              },
              {
                // 主图平滑虚线
                name: "平滑虚线",
                type: "line",
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: normalData.map((point) => [point[0], point[1] * 0.8]),
                smooth: true,
                lineStyle: {
                  color: "#fac858",
                  type: "dashed",
                  width: 2,
                },
                symbol: "none",
                z: 2,
              },
              {
                // 规格上限
                name: "规格上限",
                type: "line",
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: [
                  [this.specParams.upperLimit, 0],
                  [this.specParams.upperLimit, Math.ceil(maxBarCount * 1.2)],
                ],
                lineStyle: {
                  color: "#ff4757",
                  type: "dashed",
                  width: 2,
                },
                symbol: "none",
              },
              {
                // 规格下限
                name: "规格下限",
                type: "line",
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: [
                  [this.specParams.lowerLimit, 0],
                  [this.specParams.lowerLimit, Math.ceil(maxBarCount * 1.2)],
                ],
                lineStyle: {
                  color: "#ff4757",
                  type: "dashed",
                  width: 2,
                },
                symbol: "none",
              },
              {
                // 目标值
                name: "目标值",
                type: "line",
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: [
                  [this.specParams.target, 0],
                  [this.specParams.target, Math.ceil(maxBarCount * 1.2)],
                ],
                lineStyle: {
                  color: "#2ed573",
                  type: "solid",
                  width: 2,
                },
                symbol: "none",
              },
            ]
          : [
              {
                // 主图柱状图（不显示缩略图时）
                name: "主图分布",
                type: "bar",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: mainHistogram.data,
                itemStyle: {
                  color: "#5470c6",
                  opacity: 0.8,
                },
                barWidth: "90%",
              },
              {
                // 正态分布曲线（不显示缩略图时）
                name: "正态分布曲线",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: normalData,
                smooth: true,
                lineStyle: {
                  color: "#ff6b6b",
                  width: 2,
                },
                symbol: "none",
                z: 3,
              },
              {
                // 主图平滑虚线（不显示缩略图时）
                name: "平滑虚线",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: normalData.map((point) => [point[0], point[1] * 0.8]),
                smooth: true,
                lineStyle: {
                  color: "#fac858",
                  type: "dashed",
                  width: 2,
                },
                symbol: "none",
                z: 2,
              },
              {
                // 规格上限（不显示缩略图时）
                name: "规格上限",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [
                  [this.specParams.upperLimit, 0],
                  [this.specParams.upperLimit, Math.ceil(maxBarCount * 1.2)],
                ],
                lineStyle: {
                  color: "#ff4757",
                  type: "dashed",
                  width: 2,
                },
                symbol: "none",
              },
              {
                // 规格下限（不显示缩略图时）
                name: "规格下限",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [
                  [this.specParams.lowerLimit, 0],
                  [this.specParams.lowerLimit, Math.ceil(maxBarCount * 1.2)],
                ],
                lineStyle: {
                  color: "#ff4757",
                  type: "dashed",
                  width: 2,
                },
                symbol: "none",
              },
              {
                // 目标值（不显示缩略图时）
                name: "目标值",
                type: "line",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: [
                  [this.specParams.target, 0],
                  [this.specParams.target, Math.ceil(maxBarCount * 1.2)],
                ],
                lineStyle: {
                  color: "#2ed573",
                  type: "solid",
                  width: 2,
                },
                symbol: "none",
              },
            ],
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = params[0].name + "<br/>";
            params.forEach((param) => {
              if (param.seriesName === "主图分布") {
                result += param.seriesName + ": " + param.value[1] + " 个<br/>";
              } else if (
                param.seriesName === "正态分布曲线" ||
                param.seriesName === "平滑虚线"
              ) {
                result +=
                  param.seriesName + ": " + param.value[1].toFixed(3) + "<br/>";
              } else if (
                param.seriesName !== "缩略图分布" &&
                param.seriesName !== "缩略图正态分布" &&
                param.seriesName !== "缩略图平滑虚线"
              ) {
                result += param.seriesName + ": " + param.value[0] + "<br/>";
              }
            });
            return result;
          },
        },
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.process-capability-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  text-align: center;
  margin-bottom: 15px;
}

.chart-header h2 {
  color: #333;
  margin: 0;
  font-size: 18px;
}

.charts-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.combined-chart {
  flex: 1;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.stats-section {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  min-width: 150px;
  max-width: 170px;
  z-index: 10;
}

.left-stats {
  left: -180px;
}

.right-stats {
  right: -180px;
}

.stats-section h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background-color: #f8f9fa;
  border-radius: 3px;
}

.stat-label {
  font-weight: bold;
  color: #555;
  font-size: 12px;
}

.stat-value {
  color: #333;
  font-size: 12px;
  font-family: "Courier New", monospace;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }

  .stats-section {
    position: static;
    transform: none;
    margin: 10px 0;
    width: 100%;
    max-width: none;
  }

  .left-stats,
  .right-stats {
    left: auto;
    right: auto;
  }
}
</style>
