<template>
  <div>
    <NormalDistributionChart />
  </div>
</template>

<script>
// 导入我们刚刚创建的图表组件
import NormalDistributionChart from "@/components/NormalDistributionChart.vue";

export default {
  components: {
    NormalDistributionChart,
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  padding: 20px;
}
</style>
