/*
 * @Author: aku
 * @Date: 2025-07-22 00:30:12
 * @LastEditors: aku
 * @LastEditTime: 2025-07-29 00:42:39
 * @FilePath: \my-vue2-project\src\main.js
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'


Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
