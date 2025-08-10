<template>
  <!-- 给容器一个 class，方便添加样式 -->
  <div class="chart-page-container">
    <NormalDistributionChart></NormalDistributionChart>
  </div>
</template>

<script>
// 路径@/components/...是基于您项目配置的正确路径
import NormalDistributionChart from "@/components/NormalDistributionChart.vue";
export default {
  components: {
    NormalDistributionChart,
  },
};
</script>

<style scoped>
/* 【新增样式】 */
.chart-page-container {
  padding: 20px;
  /* 设置一个明确的高度，确保图表容器不会因高度为0而“消失” */
  height: 600px;
  box-sizing: border-box; /* 推荐加入，避免内边距影响总高度 */
}
</style>
