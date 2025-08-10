<template>
  <div ref="chart" class="k-line-chart-advanced"></div>
</template>

<script>
// 完整引入 ECharts
import * as echarts from "echarts";

export default {
  name: "KLineChartAdvanced",
  data() {
    return {
      chart: null,
      // 生成符合图片的K线数据 [开盘, 收盘, 最低, 最高]
      rawData: [
        // 2015年2月开始数据
        [3300, 3320, 3280, 3340],
        [3315, 3280, 3270, 3330],
        [3285, 3310, 3270, 3325],
        [3305, 3340, 3300, 3350],
        [3335, 3360, 3330, 3370],
        [3355, 3320, 3310, 3365],
        [3325, 3350, 3315, 3365],
        [3345, 3380, 3340, 3390],
        [3375, 3420, 3370, 3430],
        [3415, 3450, 3410, 3460],
        [3445, 3480, 3440, 3490],
        [3475, 3520, 3470, 3530],
        [3515, 3560, 3510, 3570],
        [3555, 3590, 3550, 3600],
        [3585, 3620, 3580, 3630],
        [3615, 3650, 3610, 3660],
        [3645, 3680, 3640, 3690],
        [3675, 3710, 3670, 3720],
        [3705, 3740, 3700, 3750],
        [3735, 3770, 3730, 3780],
        [3765, 3800, 3760, 3810],
        [3795, 3830, 3790, 3840],
        [3825, 3860, 3820, 3870],
        [3855, 3890, 3850, 3900],
        [3885, 3920, 3880, 3930],
        [3915, 3950, 3910, 3960],
        [3945, 3980, 3940, 3990],
        [3975, 4010, 3970, 4020],
        [4005, 4040, 4000, 4050],
        [4035, 4070, 4030, 4080],
        [4065, 4100, 4060, 4110],
        [4095, 4130, 4090, 4140],
        [4125, 4160, 4120, 4170],
        [4155, 4190, 4150, 4200],
        [4185, 4220, 4180, 4230],
        [4215, 4250, 4210, 4260],
        [4245, 4280, 4240, 4290],
        [4275, 4310, 4270, 4320],
        [4305, 4340, 4300, 4350],
        [4335, 4370, 4330, 4380],
        [4365, 4400, 4360, 4410],
        [4395, 4430, 4390, 4440],
        [4425, 4460, 4420, 4470],
        [4455, 4490, 4450, 4500],
        [4485, 4520, 4480, 4530],
        [4515, 4550, 4510, 4560],
        [4545, 4580, 4540, 4590],
        [4575, 4610, 4570, 4620],
        [4605, 4640, 4600, 4650],
        [4635, 4670, 4630, 4680],
        [4665, 4700, 4660, 4710],
        [4695, 4730, 4690, 4740],
        [4725, 4760, 4720, 4770],
        [4755, 4790, 4750, 4800],
        [4785, 4820, 4780, 4830],
        [4815, 4850, 4810, 4860],
        [4845, 4880, 4840, 4890],
        [4875, 4910, 4870, 4920],
        [4905, 4940, 4900, 4950],
        [4935, 4970, 4930, 4980],
        [4965, 5000, 4960, 5010],
        [4995, 5030, 4990, 5040],
        [5025, 5060, 5020, 5070],
        [5055, 5090, 5050, 5100],
        [5085, 5120, 5080, 5130],
        [5115, 5150, 5110, 5160],
        // 高峰期数据
        [5145, 5180, 5140, 5190],
        [5175, 5210, 5170, 5220],
        [5205, 5240, 5200, 5250],
        [5235, 5270, 5230, 5280],
        [5265, 5300, 5260, 5310],
        [5295, 5330, 5290, 5340],
        [5325, 5360, 5320, 5370],
        [5355, 5390, 5350, 5400],
        [5385, 5420, 5380, 5430],
        [5415, 5450, 5410, 5460],
        [5445, 5480, 5440, 5490],
        [5475, 5510, 5470, 5520],
        // 开始下跌
        [5505, 5480, 5470, 5520],
        [5485, 5450, 5440, 5495],
        [5455, 5420, 5410, 5465],
        [5425, 5380, 5370, 5435],
        [5385, 5340, 5330, 5395],
        [5345, 5300, 5290, 5355],
        [5305, 5260, 5250, 5315],
        [5265, 5220, 5210, 5275],
        [5225, 5180, 5170, 5235],
        [5185, 5140, 5130, 5195],
        [5145, 5100, 5090, 5155],
        [5105, 5060, 5050, 5115],
        [5065, 5020, 5010, 5075],
        [5025, 4980, 4970, 5035],
        [4985, 4940, 4930, 4995],
        [4945, 4900, 4890, 4955],
        [4905, 4860, 4850, 4915],
        [4865, 4820, 4810, 4875],
        [4825, 4780, 4770, 4835],
        [4785, 4740, 4730, 4795],
        [4745, 4700, 4690, 4755],
        [4705, 4660, 4650, 4715],
        [4665, 4620, 4610, 4675],
        [4625, 4580, 4570, 4635],
        [4585, 4540, 4530, 4595],
        [4545, 4500, 4490, 4555],
        [4505, 4460, 4450, 4515],
        [4465, 4420, 4410, 4475],
        [4425, 4380, 4370, 4435],
        [4385, 4340, 4330, 4395],
        [4345, 4300, 4290, 4355],
        [4305, 4260, 4250, 4315],
        [4265, 4220, 4210, 4275],
        [4225, 4180, 4170, 4235],
        [4185, 4140, 4130, 4195],
        [4145, 4100, 4090, 4155],
        [4105, 4060, 4050, 4115],
        [4065, 4020, 4010, 4075],
        [4025, 3980, 3970, 4035],
        [3985, 3940, 3930, 3995],
        [3945, 3900, 3890, 3955],
        [3905, 3860, 3850, 3915],
        [3865, 3820, 3810, 3875],
        [3825, 3780, 3770, 3835],
        [3785, 3740, 3730, 3795],
        [3745, 3700, 3690, 3755],
        [3705, 3660, 3650, 3715],
        [3665, 3620, 3610, 3675],
        [3625, 3580, 3570, 3635],
        [3585, 3540, 3530, 3595],
        [3545, 3500, 3490, 3555],
        [3505, 3460, 3450, 3515],
        [3465, 3420, 3410, 3475],
        [3425, 3380, 3370, 3435],
        [3385, 3340, 3330, 3395],
        [3345, 3300, 3290, 3355],
        [3305, 3260, 3250, 3315],
        [3265, 3220, 3210, 3275],
        [3225, 3180, 3170, 3235],
        [3185, 3140, 3130, 3195],
        [3145, 3100, 3090, 3155],
        [3105, 3060, 3050, 3115],
        [3065, 3020, 3010, 3075],
        [3025, 2980, 2970, 3035],
        [2985, 2940, 2930, 2995],
        [2945, 2900, 2890, 2955],
        // 底部横盘
        [2905, 2920, 2890, 2935],
        [2915, 2940, 2905, 2950],
        [2935, 2960, 2925, 2970],
        [2955, 2980, 2945, 2990],
        [2975, 3000, 2965, 3010],
        [2995, 3020, 2985, 3030],
        [3015, 3040, 3005, 3050],
        [3035, 3060, 3025, 3070],
        [3055, 3080, 3045, 3090],
        [3075, 3100, 3065, 3110],
        [3095, 3120, 3085, 3130],
        [3115, 3140, 3105, 3150],
        [3135, 3160, 3125, 3170],
        [3155, 3180, 3145, 3190],
        [3175, 3200, 3165, 3210],
        [3195, 3220, 3185, 3230],
        [3215, 3240, 3205, 3250],
        [3235, 3260, 3225, 3270],
        [3255, 3280, 3245, 3290],
        [3275, 3300, 3265, 3310],
        [3295, 3320, 3285, 3330],
        [3315, 3340, 3305, 3350],
        [3335, 3360, 3325, 3370],
        [3355, 3380, 3345, 3390],
        [3375, 3400, 3365, 3410],
        [3395, 3420, 3385, 3430],
        [3415, 3440, 3405, 3450],
        [3435, 3460, 3425, 3470],
        [3455, 3480, 3445, 3490],
        [3475, 3500, 3465, 3510],
        [3495, 3520, 3485, 3530],
        [3515, 3540, 3505, 3550],
        [3535, 3560, 3525, 3570],
        [3555, 3580, 3545, 3590],
        [3575, 3600, 3565, 3610],
        [3595, 3620, 3585, 3630],
        [3615, 3640, 3605, 3650],
        [3635, 3660, 3625, 3670],
        [3655, 3680, 3645, 3690],
        [3675, 3700, 3665, 3710],
        [3695, 3720, 3685, 3730],
        [3715, 3740, 3705, 3750],
        [3735, 3760, 3725, 3770],
      ],
      dates: [],
    };
  },
  mounted() {
    // 生成日期数据
    this.generateDates();
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    generateDates() {
      const startDate = new Date("2015-02-04");
      const dates = [];

      for (let i = 0; i < this.rawData.length; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i * 2); // 每隔2天一个数据点
        dates.push(currentDate.toISOString().split("T")[0].slice(5)); // 格式：MM-DD
      }

      this.dates = dates;
    },

    calculateMA(dayCount, data) {
      var result = [];
      for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount - 1) {
          result.push(null);
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += +data[i - j][1]; // 按收盘价计算
        }
        result.push(sum / dayCount);
      }
      return result;
    },

    initChart() {
      this.chart = echarts.init(this.$refs.chart, null, { renderer: "canvas" });

      const upColor = "#00da3c"; // 绿色-涨
      const downColor = "#ec0000"; // 红色-跌

      // 准备MA数据
      const ma5 = this.calculateMA(5, this.rawData);
      const ma10 = this.calculateMA(10, this.rawData);
      const ma20 = this.calculateMA(20, this.rawData);
      const ma30 = this.calculateMA(30, this.rawData);

      const option = {
        backgroundColor: "#ffffff",
        legend: {
          data: [
            {
              name: "MA5",
              icon: "path://M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
              itemStyle: { color: "#6CB2FF" },
            },
            {
              name: "MA10",
              icon: "circle",
              itemStyle: { color: "#FFD700" },
            },
            {
              name: "MA20",
              icon: "path://M2,12 L22,12",
              itemStyle: { color: "#9966CC" },
            },
            {
              name: "MA30",
              icon: "path://M2,12 L22,12",
              itemStyle: { color: "#FF9500" },
            },
          ],
          top: 10,
          left: "center",
          textStyle: {
            color: "#666666",
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: (params) => {
            let candlestickParam = params.find(
              (p) => p.seriesType === "candlestick"
            );
            if (!candlestickParam) return;
            const data = candlestickParam.data;
            const date = candlestickParam.name;
            let html = `2015/${date}<br/>`;
            html += `开盘: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[0].toFixed(0)}</span><br/>`;
            html += `收盘: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[1].toFixed(0)}</span><br/>`;
            html += `最低: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[2].toFixed(0)}</span><br/>`;
            html += `最高: <span style="color: ${
              data[1] > data[0] ? upColor : downColor
            };">${data[3].toFixed(0)}</span><br/>`;

            params.forEach((param) => {
              if (
                param.seriesType === "line" &&
                param.value !== undefined &&
                param.value !== null
              ) {
                html += `${param.seriesName}: <span style="color: ${
                  param.color
                };">${Number(param.value).toFixed(0)}</span><br/>`;
              }
            });

            return html;
          },
        },
        grid: {
          left: 60,
          right: 60,
          top: 60,
          bottom: 60,
        },
        xAxis: {
          type: "category",
          data: this.dates,
          axisLine: {
            show: true,
            lineStyle: { color: "#cccccc" },
          },
          axisTick: { show: false },
          axisLabel: {
            color: "#666666",
            fontSize: 10,
          },
          splitLine: { show: false },
        },
        yAxis: {
          type: "value",
          scale: true,
          min: 1000,
          max: 6000,
          interval: 1000,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#666666",
            fontSize: 10,
            formatter: "{value}",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f0f0f0",
              type: "solid",
              width: 0.5,
            },
          },
        },
        series: [
          {
            name: "K线",
            type: "candlestick",
            data: this.rawData,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upColor,
              borderColor0: downColor,
              borderWidth: 1,
            },
          },
          // MA5: 蓝色实线
          {
            name: "MA5",
            type: "line",
            data: ma5,
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#6CB2FF",
              width: 1.5,
            },
          },
          // MA10: 黄色圆点线
          {
            name: "MA10",
            type: "line",
            data: ma10,
            smooth: true,
            symbol: "circle",
            symbolSize: 3,
            itemStyle: {
              color: "#FFD700",
            },
            lineStyle: {
              color: "#FFD700",
              width: 1.2,
            },
          },
          // MA20: 紫色虚线
          {
            name: "MA20",
            type: "line",
            data: ma20,
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#9966CC",
              width: 1.5,
              type: "dashed",
            },
          },
          // MA30: 橙色虚线
          {
            name: "MA30",
            type: "line",
            data: ma30,
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#FF9500",
              width: 1.5,
              type: "dashed",
            },
          },
        ],
      };

      this.chart.setOption(option);
      window.addEventListener("resize", this.resizeChart);
    },

    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style scoped>
.k-line-chart-advanced {
  width: 100%;
  height: 600px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
