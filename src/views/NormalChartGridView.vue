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
// 引入我们刚刚修改好的、可复用的图表组件
import NormalDistributionChart from "@/components/NormalDistributionChart.vue";

export default {
  name: "NormalChartGridView",
  components: {
    NormalDistributionChart,
  },
  data() {
    return {
      // 为4个图表定义不同的配置数据
      chartConfigs: [
        {
          id: 1,
          title: "产品线 A - 长度分布",
          mean: 100,
          stdDev: 15,
          lowerLimit: 70,
          upperLimit: 130,
          target: 100,
        },
        {
          id: 2,
          title: "产品线 B - 重量分布",
          mean: 85,
          stdDev: 8,
          lowerLimit: 70,
          upperLimit: 100,
          target: 85,
        },
        {
          id: 3,
          title: "产品线 C - 压力测试",
          mean: 120,
          stdDev: 25,
          lowerLimit: 80,
          upperLimit: 160,
          target: 110,
        },
        {
          id: 4,
          title: "产品线 D - 温度监控",
          mean: 92,
          stdDev: 5,
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
  flex-wrap: wrap; /* 允许换行 */
  padding: 20px;
  gap: 20px; /* 定义网格间距 */
  background-color: #f4f7f9;
  height: 100vh; /* 让容器铺满整个视口高度 */
  box-sizing: border-box;
}

.chart-cell {
  /* 关键：计算宽度以实现两列布局 */
  width: calc(50% - 10px); /* 50% 宽度减去一半的间距 */
  /* 关键：计算高度以实现两行布局 */
  height: calc(50% - 10px); /* 50% 高度减去一半的间距 */
  box-sizing: border-box;
}

/* 媒体查询，在小屏幕上变为单列布局 */
@media (max-width: 768px) {
  .chart-cell {
    width: 100%;
    height: 400px; /* 在移动端给一个固定高度 */
  }
}
</style>
