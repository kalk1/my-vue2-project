<!--
 * @Author: aku
 * @Date: 2025-07-23 17:35:05
 * @LastEditors: aku
 * @LastEditTime: 2025-07-23 20:08:41
 * @FilePath: \my-vue2-project\src\package\zsl-button\index.vue
 * @Description: 
-->
<template>
  <div>
    <button>测试按钮</button>
  </div>
</template>

<script>
export default {
  name: "zsl-button", //组件名
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>

<style scoped>
button {
  z-index: 1;
  position: relative;
  font-size: inherit;
  font-family: inherit;
  color: white;
  padding: 0.5em 1em;
  outline: none;
  border: none;
  background-color: hsl(236, 32%, 26%);
  overflow: hidden;
  transition: color 0.4s ease-in-out;
}

button::before {
  content: "";
  z-index: -1;
  position: absolute;
  top: 100%;
  left: 100%;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #3cefff;
  transform-origin: center;
  transform: translate3d(50%, -50%, 0) scale3d(0, 0, 0);
  transition: transform 0.45s ease-in-out;
}

button:hover {
  cursor: pointer;
  color: #161616;
}
button:hover::before {
  transform: translate3d(50%, -50%, 0) scale3d(15, 15, 15);
}
</style>
