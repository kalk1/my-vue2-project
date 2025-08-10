<template>
  <div class="boxplot-container">
    <h2>箱线图数据分析</h2>
    <charts-view :option="boxplotOption" width="100%" height="500px" />
    
    <div class="data-summary">
      <h3>数据统计摘要</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">样本数量:</span>
          <span class="stat-value">{{ stats.count }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最小值:</span>
          <span class="stat-value">{{ stats.min.toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最大值:</span>
          <span class="stat-value">{{ stats.max.toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">中位数:</span>
          <span class="stat-value">{{ stats.median.toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均值:</span>
          <span class="stat-value">{{ stats.mean.toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">标准差:</span>
          <span class="stat-value">{{ stats.std.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartsView from '@/components/chartsView.vue';

export default {
  name: 'BoxPlotView',
  components: {
    ChartsView
  },
  data() {
    return {
      boxplotOption: {},
      stats: {
        count: 0,
        min: 0,
        max: 0,
        median: 0,
        mean: 0,
        std: 0
      }
    };
  },
  mounted() {
    this.generateBoxPlotData();
  },
  methods: {
    generateBoxPlotData() {
      // 生成多组数据用于箱线图对比
      const datasets = [
        this.generateNormalData(100, 50, 15),
        this.generateNormalData(100, 60, 20),
        this.generateNormalData(100, 45, 12),
        this.generateNormalData(100, 55, 18)
      ];

      const categories = ['数据集A', '数据集B', '数据集C', '数据集D'];
      
      // 计算统计数据
      this.calculateStats(datasets[0]);
      
      // 准备箱线图数据
      const boxplotData = datasets.map(data => this.calculateBoxPlotValues(data));
      
      this.boxplotOption = {
        title: {
          text: '多组数据箱线图对比分析',
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            const data = params.data;
            return `
              <strong>${params.name}</strong><br/>
              最大值: ${data[5].toFixed(2)}<br/>
              上四分位: ${data[4].toFixed(2)}<br/>
              中位数: ${data[3].toFixed(2)}<br/>
              下四分位: ${data[2].toFixed(2)}<br/>
              最小值: ${data[1].toFixed(2)}<br/>
              异常值: ${data[0] || '无'}
            `;
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: categories,
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '数值',
          min: 0,
          max: 100,
          splitArea: {
            show: true
          }
        },
        series: [
          {
            name: '箱线图',
            type: 'boxplot',
            datasetIndex: 0,
            data: boxplotData,
            itemStyle: {
              color: '#5470c6',
              borderColor: '#333'
            },
            emphasis: {
              itemStyle: {
                color: '#91cc75'
              }
            }
          },
          {
            name: '异常值',
            type: 'scatter',
            data: this.findOutliers(datasets, categories),
            symbolSize: 8,
            itemStyle: {
              color: '#ee6666'
            }
          }
        ]
      };
    },
    
    // 生成正态分布数据
    generateNormalData(count, mean, std) {
      const data = [];
      for (let i = 0; i < count; i++) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        data.push(mean + std * z);
      }
      return data;
    },
    
    // 计算箱线图所需的五个数值
    calculateBoxPlotValues(data) {
      const sorted = [...data].sort((a, b) => a - b);
      const n = sorted.length;
      
      const q1 = this.percentile(sorted, 25);
      const median = this.percentile(sorted, 50);
      const q3 = this.percentile(sorted, 75);
      
      const iqr = q3 - q1;
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      
      const min = Math.max(sorted[0], lowerFence);
      const max = Math.min(sorted[n - 1], upperFence);
      
      return [0, min, q1, median, q3, max];
    },
    
    // 计算百分位数
    percentile(sortedArray, p) {
      const index = (p / 100) * (sortedArray.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      
      if (lower === upper) {
        return sortedArray[lower];
      }
      
      const weight = index - lower;
      return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
    },
    
    // 查找异常值
    findOutliers(datasets, categories) {
      const outliers = [];
      
      datasets.forEach((data, index) => {
        const sorted = [...data].sort((a, b) => a - b);
        const q1 = this.percentile(sorted, 25);
        const q3 = this.percentile(sorted, 75);
        const iqr = q3 - q1;
        const lowerFence = q1 - 1.5 * iqr;
        const upperFence = q3 + 1.5 * iqr;
        
        data.forEach(value => {
          if (value < lowerFence || value > upperFence) {
            outliers.push([categories[index], value]);
          }
        });
      });
      
      return outliers;
    },
    
    // 计算基本统计量
    calculateStats(data) {
      const sorted = [...data].sort((a, b) => a - b);
      const n = data.length;
      
      this.stats = {
        count: n,
        min: Math.min(...data),
        max: Math.max(...data),
        median: this.percentile(sorted, 50),
        mean: data.reduce((sum, val) => sum + val, 0) / n,
        std: Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - data.reduce((s, v) => s + v, 0) / n, 2), 0) / n)
      };
    }
  }
};
</script>

<style scoped>
.boxplot-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.data-summary {
  margin-top: 40px;
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.data-summary h3 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-label {
  font-weight: bold;
  color: #666;
}

.stat-value {
  color: #333;
  font-weight: bold;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
