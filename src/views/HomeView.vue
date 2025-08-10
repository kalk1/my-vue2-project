<!--
 * @Author: aku
 * @Date: 2025-07-29 00:34:08
 * @LastEditors: aku
 * @LastEditTime: 2025-08-03 16:58:00
 * @FilePath: \my-vue2-project\src\views\HomeView.vue
 * @Description: 
-->
<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>欢迎来到Vue2项目</h1>
      <p>这是一个包含多种功能的演示项目</p>
    </div>

    <div class="features-grid">
      <!-- <div class="feature-card">
        <charts-view :option="normalDistributionOption" width="100%" height="300px" />
        <h3>数据分析</h3>
        <p>基于对数正态分布的数据可视化分析</p>
      </div> -->
      <div class="feature-card">
        <KLineChart
          :option="normalDistributionOption"
          width="100%"
          height="300px"
        />
        <h3>数据分析</h3>
        <p>基于对数正态分布的数据可视化分析</p>
      </div>

      <div class="feature-card" @click="goToKLineAdvanced">
        <div class="feature-icon">📈</div>
        <h3>高级K线图表</h3>
        <p>专业的股票K线图表，包含移动平均线和完整的技术指标</p>
        <button class="feature-btn">查看图表</button>
      </div>
    </div>
  </div>
</template>

<script>
// import ChartsView from "@/components/chartsView.vue";
import KLineChart from "@/components/KLineChart.vue";

export default {
  components: {
    // ChartsView,
    KLineChart,
  },
  data() {
    return {
      normalDistributionOption: this.generateNormalDistributionOption(),
    };
  },
  methods: {
    goToKLineAdvanced() {
      this.$router.push("/kline-advanced");
    },

    generateNormalDistributionOption() {
      // 生成对数正态分布数据
      const data = [];
      const logData = [];
      const mu = 0.44; // 位置参数
      const sigma = 0.74; // 尺度参数
      const step = 0.1;
      const start = 0.1;
      const end = 7;
      const lowerLimit = 2; // 下限
      const target = 7; // 目标

      // 生成柱状图数据
      for (let x = start; x <= end; x += step) {
        const logX = Math.log(x);
        const y =
          (1 / (x * sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-Math.pow(logX - mu, 2) / (2 * Math.pow(sigma, 2)));
        data.push([x.toFixed(1), y.toFixed(4)]);
      }

      // 生成曲线图数据（更密集）
      for (let x = start; x <= end; x += 0.01) {
        const logX = Math.log(x);
        const y =
          (1 / (x * sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-Math.pow(logX - mu, 2) / (2 * Math.pow(sigma, 2)));
        logData.push([x.toFixed(2), y.toFixed(4)]);
      }

      return {
        title: {
          text: "基于对数正态分布模型的计算",
          left: "center",
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b}: {c}",
        },
        grid: {
          left: "15%",
          right: "15%",
          bottom: "10%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          splitLine: { show: true },
          axisLabel: {
            formatter: "{value}",
          },
        },
        yAxis: {
          type: "value",
          splitLine: { show: true },
          axisLabel: {
            formatter: "{value}",
          },
        },
        series: [
          {
            name: "频率",
            type: "bar",
            data: data,
            itemStyle: {
              color: "#3888fa",
            },
            barWidth: "60%",
          },
          {
            name: "对数正态分布",
            type: "line",
            data: logData,
            smooth: true,
            lineStyle: {
              width: 2,
              color: "#d93f30",
            },
            symbol: "none",
          },
        ],
        markLine: {
          symbol: "none",
          data: [
            {
              name: "下限",
              xAxis: lowerLimit,
              lineStyle: {
                color: "#d93f30",
                type: "dashed",
              },
              label: {
                formatter: "下限",
                position: "top",
              },
            },
            {
              name: "目标",
              xAxis: target,
              lineStyle: {
                color: "#00b42a",
                type: "dashed",
              },
              label: {
                formatter: "目标",
                position: "top",
              },
            },
          ],
        },
        graphic: [
          {
            type: "group",
            left: "5%",
            top: "15%",
            children: [
              {
                type: "text",
                left: 0,
                top: 0,
                style: {
                  text: "过程数据",
                  font: "14px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 20,
                style: {
                  text: "下限: 2",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 40,
                style: {
                  text: "目标: 7",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 60,
                style: {
                  text: "规格上限: *",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 80,
                style: {
                  text: "样本均值: 2.92307",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 100,
                style: {
                  text: "样本N: 100",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 120,
                style: {
                  text: "位置: 0.442206",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 140,
                style: {
                  text: "尺度: 0.744435",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
            ],
          },
          {
            type: "group",
            right: "5%",
            top: "15%",
            children: [
              {
                type: "text",
                left: 0,
                top: 0,
                style: {
                  text: "整体",
                  font: "14px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 20,
                style: {
                  text: "基准Z值",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 40,
                style: {
                  text: "下限Z值",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 60,
                style: {
                  text: "规格上限:",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 80,
                style: {
                  text: "Ppk",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 120,
                style: {
                  text: "预测频",
                  font: "14px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 140,
                style: {
                  text: "% < 下限: 34.00",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 160,
                style: {
                  text: "% > 规格上限: *",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
              {
                type: "text",
                left: 0,
                top: 180,
                style: {
                  text: "% 合计: 34.00",
                  font: "12px sans-serif",
                  fill: "#333",
                },
              },
            ],
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 50px;
}

.welcome-section h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 1.2em;
  color: #666;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background: #fff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 20px;
  text-align: center;
}

.feature-card h3 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
}

.feature-btn {
  display: block;
  margin: 0 auto;
  padding: 12px 30px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .welcome-section h1 {
    font-size: 2em;
  }
}
</style>
