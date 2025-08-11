<template>
  <div class="process-capability-dashboard">
    <div class="dashboard-header">
      <h1>过程能力分析仪表板</h1>
      <p>多维度过程能力分析报告展示</p>
    </div>

    <div class="cards-grid">
      <ProcessCapabilityCard
        v-for="card in cardsData"
        :key="card.id"
        :card-id="card.id"
        :title="card.title"
        :spec-params="card.specParams"
        :data-params="card.dataParams"
        :show-thumbnail="card.showThumbnail"
      />
    </div>
  </div>
</template>

<script>
import ProcessCapabilityCard from "@/components/ProcessCapabilityCard.vue";

export default {
  name: "ProcessCapabilityDashboard",
  components: {
    ProcessCapabilityCard,
  },
  data() {
    return {
      cardsData: [
        {
          id: 1,
          title: "产品A过程能力分析",
          specParams: {
            lowerLimit: 2.0,
            upperLimit: 8.0,
            target: 5.0,
          },
          dataParams: {
            mean: 5.0,
            stdDev: 1.2,
            count: 200,
          },
          showThumbnail: true, // 显示缩略图
        },
        {
          id: 2,
          title: "产品B过程能力分析",
          specParams: {
            lowerLimit: 1.5,
            upperLimit: 6.5,
            target: 4.0,
          },
          dataParams: {
            mean: 4.0,
            stdDev: 0.8,
            count: 180,
          },
          showThumbnail: false, // 不显示缩略图
        },
        {
          id: 3,
          title: "产品C过程能力分析",
          specParams: {
            lowerLimit: 3.0,
            upperLimit: 9.0,
            target: 6.0,
          },
          dataParams: {
            mean: 6.0,
            stdDev: 1.5,
            count: 220,
          },
          showThumbnail: true, // 显示缩略图
        },
        {
          id: 4,
          title: "产品D过程能力分析",
          specParams: {
            lowerLimit: 0.8,
            upperLimit: 4.2,
            target: 2.5,
          },
          dataParams: {
            mean: 2.5,
            stdDev: 0.6,
            count: 150,
          },
          showThumbnail: false, // 不显示缩略图
        },
        {
          id: 5,
          title: "产品E过程能力分析",
          specParams: {
            lowerLimit: 4.5,
            upperLimit: 11.5,
            target: 8.0,
          },
          dataParams: {
            mean: 8.0,
            stdDev: 1.8,
            count: 250,
          },
          showThumbnail: true, // 显示缩略图
        },
      ],
    };
  },
};
</script>

<style scoped>
.process-capability-dashboard {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
}

.dashboard-header p {
  color: #666;
  margin: 0;
  font-size: 16px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 确保每行最多两个卡片 */
@media (min-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 响应式设计 */
@media (max-width: 1199px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .process-capability-dashboard {
    padding: 15px;
  }

  .dashboard-header h1 {
    font-size: 24px;
  }

  .dashboard-header p {
    font-size: 14px;
  }

  .cards-grid {
    gap: 15px;
  }
}
</style>
