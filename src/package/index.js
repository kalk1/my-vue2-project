/*
 * @Author: aku
 * @Date: 2025-07-23 18:24:22
 * @LastEditors: aku
 * @LastEditTime: 2025-07-23 20:12:25
 * @FilePath: \my-vue2-project\src\package\index.js
 * @Description: 
 */
import zslButton from '../package/zsl-button/index.vue'
import { handleFirstUpperCase, handleRoundOff } from '../package/public-js/index.js'

// 确保组件正确导入
if (!zslButton.name) {
  zslButton.name = 'zsl-button'
}

const install = function (Vue) {
  // 使用安全的组件注册方式
  Vue.component(zslButton.name, zslButton)
}

// 使用更安全的日志输出方式
// const safeLog = (obj) => {
//   try {
//     return JSON.parse(JSON.stringify(obj))
//   } catch (e) {
//     return '[Circular or non-serializable object]'
//   }
// }

console.log("zsl-button2222", zslButton)

export default {
  install,
  handleFirstUpperCase,
  handleRoundOff
}