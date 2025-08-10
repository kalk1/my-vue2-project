<template>
  <div class="k-line-advanced-view">
    <h1>高级K线图表</h1>
    <p>这是根据您提供的图片创建的K线图组件</p>
    <KLineChartAdvanced />
  </div>
</template>

<script>
import KLineChartAdvanced from "@/components/KLineChartAdvanced.vue";

export default {
  name: "KLineAdvancedView",
  components: {
    KLineChartAdvanced,
  },
};
</script>

<style scoped>
.k-line-advanced-view {
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}
</style>
