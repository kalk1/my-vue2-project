<template>
  <div class="chart-grid-container">
    <!-- 使用 v-for 循环渲染多个图表 -->
    <div v-for="config in chartConfigs" :key="config.id" class="chart-cell">
      <!-- 引入图表组件，并通过 props 传入独立的配置 -->
      <NormalDistributionChart :chart-config="config" />
    </div>
  </div>
</template>

<script>
import NormalDistributionChart from "@/components/NormalDistributionChart.vue";

/**
 * 【核心修改】一个新的辅助函数，用于生成更真实的、适合展示的直方图数据
 * @param {object} config - 包含 mean 和 stdDev 的配置对象
 * @returns {{barData: Array, lineData: Array}} - 返回图表所需的数据
 */
const generateHistogramData = (config) => {
  const { mean, stdDev, dataCount = 10000, barCount = 50 } = config;
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

  // 生成分箱后的柱状图数据，x轴是均匀的
  const barData = bins.map((count, i) => [minX + (i + 0.5) * binWidth, count]);

  // 生成对应的曲线数据
  const lineData = [];
  const step = (maxX - minX) / 200;
  const maxBarHeight = Math.max(...bins);
  for (let x = minX; x <= maxX; x += step) {
    const yValue =
      Math.sin(((x - minX) / (maxX - minX)) * Math.PI * 4) *
        (maxBarHeight / 3) +
      maxBarHeight / 2.5;
    lineData.push([x, yValue]);
  }
  return { barData, lineData };
};

export default {
  name: "NormalChartGridView",
  components: {
    NormalDistributionChart,
  },
  data() {
    // 【修改点】为所有4个图表都生成并传入数据
    const chart1Data = generateHistogramData({ mean: 100, stdDev: 15 });
    const chart2Data = generateHistogramData({ mean: 85, stdDev: 8 });
    const chart3Data = generateHistogramData({ mean: 120, stdDev: 25 });
    const chart4Data = generateHistogramData({ mean: 92, stdDev: 5 });

    return {
      chartConfigs: [
        {
          id: 1,
          title: "产品线 A - 长度分布",
          barData: chart1Data.barData,
          lineData: chart1Data.lineData,
          lowerLimit: 70,
          upperLimit: 130,
          target: 100,
        },
        {
          id: 2,
          title: "产品线 B - 重量分布",
          barData: chart2Data.barData,
          lineData: chart2Data.lineData,
          lowerLimit: 70,
          upperLimit: 100,
          target: 85,
        },
        {
          id: 3,
          title: "产品线 C - 压力测试",
          barData: chart3Data.barData,
          lineData: chart3Data.lineData,
          lowerLimit: 80,
          upperLimit: 160,
          target: 110,
        },
        {
          id: 4,
          title: "产品线 D - 温度监控",
          barData: chart4Data.barData,
          lineData: chart4Data.lineData,
          lowerLimit: 85,
          upperLimit: 100,
          target: 90,
        },
      ],
    };
  },
};
</script>

<style scoped>
.chart-grid-container {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  background-color: #f4f7f9;
  height: 100vh;
  box-sizing: border-box;
}

.chart-cell {
  width: calc(50% - 10px);
  height: calc(50% - 10px);
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .chart-cell {
    width: 100%;
    height: 400px;
  }
}
</style>
