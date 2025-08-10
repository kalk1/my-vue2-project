<template>
  <div>
    <div>显示的时间：{{ time }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {},
  computed: {
    time: function () {
      return Date.now();
    },
  },
  mounted() {},
};
</script>

<style lang="scss"></style>
