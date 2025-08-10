<template>
  <div class="chart-test-container">
    <h2>基于对数正态分布模型的计算</h2>
    <charts-view :option="chartOption" width="100%" height="500px" />
  </div>
</template>

<script>
import ChartsView from '@/components/chartsView.vue';

export default {
  name: 'ChartTestView',
  components: {
    ChartsView
  },
  data() {
    return {
      chartOption: {}
    };
  },
  mounted() {
    this.generateChartData();
  },
  methods: {
    generateChartData() {
      // 生成对数正态分布数据
      const logNormalData = this.generateLogNormalData(1000, 1.5, 0.5);
      
      // 创建直方图数据
      const histogramData = this.createHistogram(logNormalData, 0, 12, 30);
      
      // 生成拟合曲线数据
      const fitLineData = this.generateFitLine(0, 12, 0.1);
      
      this.chartOption = {
        title: {
          text: '基于对数正态分布模型的计算',
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['直方图', '拟合曲线'],
          top: 40
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: 'X',
          min: 0,
          max: 12,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '频数/频率',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '直方图',
            type: 'bar',
            data: histogramData,
            itemStyle: {
              color: '#5470c6'
            },
            barWidth: '90%',
            barGap: '0%'
          },
          {
            name: '拟合曲线',
            type: 'line',
            data: fitLineData,
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#ee6666',
              width: 2
            }
          },
          // 下限标记线
          {
            name: '下限',
            type: 'line',
            markLine: {
              silent: true,
              symbol: 'none',
              lineStyle: {
                color: '#ff0000',
                type: 'dashed',
                width: 2
              },
              label: {
                formatter: '下限 (X≈2)',
                position: 'end'
              },
              data: [
                {
                  xAxis: 2
                }
              ]
            }
          },
          // 目标标记线
          {
            name: '目标',
            type: 'line',
            markLine: {
              silent: true,
              symbol: 'none',
              lineStyle: {
                color: '#00ff00',
                type: 'dashed',
                width: 2
              },
              label: {
                formatter: '目标 (X≈7-8)',
                position: 'end'
              },
              data: [
                {
                  xAxis: 7.5
                }
              ]
            }
          }
        ]
      };
    },
    
    // 生成对数正态分布随机数据
    generateLogNormalData(count, mu, sigma) {
      const data = [];
      for (let i = 0; i < count; i++) {
        // Box-Muller变换生成正态分布
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        
        // 转换为对数正态分布
        const value = Math.exp(mu + sigma * z);
        data.push(value);
      }
      return data;
    },
    
    // 创建直方图数据
    createHistogram(data, min, max, bins) {
      const binWidth = (max - min) / bins;
      const histogram = [];
      
      for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        const count = data.filter(val => val >= binStart && val < binEnd).length;
        histogram.push([binStart + binWidth / 2, count]);
      }
      
      return histogram;
    },
    
    // 生成拟合曲线数据
    generateFitLine(min, max, step) {
      const data = [];
      const mu = 1.5;
      const sigma = 0.5;
      
      for (let x = min; x <= max; x += step) {
        if (x > 0) {
          // 对数正态分布概率密度函数
          const lnX = Math.log(x);
          const exponent = -Math.pow(lnX - mu, 2) / (2 * Math.pow(sigma, 2));
          const pdf = (1 / (x * sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
          
          // 缩放到合适的频数范围
          const scaledValue = pdf * 1000;
          data.push([x, scaledValue]);
        } else {
          data.push([x, 0]);
        }
      }
      
      return data;
    }
  }
};
</script>

<style scoped>
.chart-test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
</style>
