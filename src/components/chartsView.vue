<template>
  <div ref="chart" :style="{ width, height }"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    option: { type: Object, required: true },   // 图表配置项
    width: { type: String, default: "100%" },   // 图表宽度
    height: { type: String, default: "400px" }, // 图表高度
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.resizeHandler);
  },
  beforeDestroy() {
    // 销毁组件时移除监听并销毁图表实例
    window.removeEventListener("resize", this.resizeHandler);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  watch: {
    // 深度监听配置项变化
    option: {
      deep: true,
      handler(newOption) {
        if (this.chartInstance) {
          this.chartInstance.setOption(newOption, true); // true 表示替换配置
        }
      }
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption(this.option);
    },
    // 响应式调整大小
    resizeHandler() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    // 暴露实例方法（可选）
    getChartInstance() {
      return this.chartInstance;
    }
  }
};
</script>