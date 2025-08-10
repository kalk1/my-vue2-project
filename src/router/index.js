import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由组件
import Home from '@/views/HomeView.vue'
import SnakeGame from '@/components/SnakeGame.vue'
import ChartTest from '@/views/chartTestView.vue'
import BoxPlot from '@/views/BoxPlotView.vue'
import KLineAdvanced from '@/views/KLineAdvancedView.vue'
import NormalChart from '@/views/NormalChart.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页 - Vue路由演示' }
  },
  {
    path: '/snake-game',
    name: 'snake-game',
    component: SnakeGame,
    meta: { title: '炫酷贪吃蛇游戏' }
  },
  {
    path: '/chart-test',
    name: 'chart-test',
    component: ChartTest,
    meta: { title: '对数正态分布图表' }
  },
  {
    path: '/boxplot',
    name: 'boxplot',
    component: BoxPlot,
    meta: { title: '箱线图数据分析' }
  },
  {
    path: '/kline-advanced',
    name: 'kline-advanced',
    component: KLineAdvanced,
    meta: { title: '高级K线图表' }
  },
  {
    path: '/normal-chart',
    name: 'NormalChart',
    component: NormalChart,
    meta: { title: '正态分布' },
    // component: () => import('@/views/NormalChart.vue'),

  }
]

const router = new VueRouter({
  mode: 'history', // 使用history模式，去除URL中的#
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    // 页面切换时滚动到顶部
    return { x: 0, y: 0 }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Vue路由演示'
  next()
})

export default router
