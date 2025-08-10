<template>
  <!-- 给容器一个class，方便添加样式 -->
  <div class="chart-page-container">
    <NormalDistributionChart></NormalDistributionChart>
  </div>
</template>

<script>
import NormalDistributionChart from "@/components/NormalDistributionChart.vue";
export default {
  components: {
    NormalDistributionChart,
  },
};
</script>

<style scoped>
/* 新增样式 */
.chart-page-container {
  padding: 20px;
  /* 设置一个高度，确保图表容器不会塌陷 */
  height: 600px;
}
</style>
