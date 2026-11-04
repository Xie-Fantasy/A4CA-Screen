<template>
  <PanelContainer title="回访分析">
    <div ref="el" class="chart"></div>
  </PanelContainer>
</template>

<script setup>
import * as echarts from "echarts"
import { onMounted, onBeforeUnmount, ref } from "vue"
import PanelContainer from "../PanelContainer.vue"
// import { getFollowupReasonAnalysis } from "@/api/dashboard"
import mockData from '@/api/mockData'

const el = ref(null)
let chart = null
const data = ref([])

// 获取回访原因分析数据（当前使用静态假数据）
async function fetchData() {
  try {
    // const res = await getFollowupReasonAnalysis()
    const res = mockData.getFollowupReasonAnalysis
    console.log('回访原因分析数据:', res)
    if (res && res.code === 200 && res.data && Array.isArray(res.data)) {
      data.value = res.data
      // 数据加载完成后重新渲染图表
      if (chart) {
        chart.setOption({
          series: [{
            data: data.value
          }]
        })
      }
    } else {
      console.warn('回访原因分析数据格式异常，使用默认数据')
      useDefaultData()
      if (chart) {
        chart.setOption({
          series: [{
            data: data.value
          }]
        })
      }
    }
  } catch (error) {
    console.error("获取回访原因分析失败:", error)
    useDefaultData()
    if (chart) {
      chart.setOption({
        series: [{
          data: data.value
        }]
      })
    }
  }
}

// 使用默认数据
function useDefaultData() {
  data.value = [
    { name: "检查结果异常", value: 18 },
    { name: "术后恢复观察", value: 18 },
    { name: "慢病随访管理", value: 17 },
    { name: "复诊提醒", value: 13 },
    { name: "用药情况跟踪", value: 10 },
    { name: "症状变化确认", value: 10 },
    { name: "其他", value: 14 },
  ]
}

function render() {
  chart = echarts.init(el.value)
  chart.setOption({
    tooltip: { trigger: "item" },
    legend: {
      orient: "vertical",
      left: "54%", // 再整体左移
      top: "middle", // 撤回下移，回到之前的垂直居中
      textStyle: { color: "#FFFFFF", fontSize: 13 },
      formatter: (name) => {
        const item = data.value.find((d) => d.name === name)
        return item ? `${name}  ${item.value}%` : name
      },
      itemGap: 12,
      itemWidth: 20,
      itemHeight: 12,
    },
    series: [
      {
        type: "pie",
        radius: ["32%", "70%"], // 圆环整体增大
        center: ["30%", "50%"], // 回到之前的垂直居中
        itemStyle: { borderWidth: 0 }, // 去黑色描边
        label: { show: false }, // 删除扇形上的文字
        labelLine: { show: false }, // 删除指向线
        data: data.value,
      },
    ],
  })
}

onMounted(() => {
  fetchData()
  render()
  window.addEventListener("resize", resize)
})

function resize() {
  chart && chart.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize)
  chart && chart.dispose()
})
</script>

<style scoped>
.chart { width: 100%; height: 100%; }
</style>
