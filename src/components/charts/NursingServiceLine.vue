<template>
  <PanelContainer title="回访服务">
    <div ref="el" class="chart"></div>
  </PanelContainer>
</template>

<script setup>
import * as echarts from "echarts"
import { onMounted, onBeforeUnmount, ref } from "vue"
import PanelContainer from "../PanelContainer.vue"
// import { getFollowupStatsByMonth } from "@/api/dashboard"
import mockData from '@/api/mockData'

const el = ref(null)
let chart = null

// 生成近一年 12 个月月份标签
function last12Months() {
  const labels = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(`${d.getMonth() + 1}月`)
  }
  return labels.reverse()
}

// 生成近一年 12 个月的年月对象
function last12MonthsObjects() {
  const objects = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    objects.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${d.getMonth() + 1}月`
    })
  }
  return objects.reverse()
}

// 回访方式数据
const followupData = ref({
  phone: [],
  wechat: [],
  outpatient: [],
  video: []
})

// 获取回访统计数据（当前使用静态假数据）
async function fetchFollowupStats() {
  try {
    // const res = await getFollowupStatsByMonth()
    const res = mockData.getFollowupStatsByMonth
    console.log('回访统计数据:', res)
    
    // 获取近 12 个月的月份对象
    const targetMonths = last12MonthsObjects()
    
    if (res && res.code === 200 && res.data && Array.isArray(res.data)) {
      const monthData = res.data.filter(item => item !== null && item !== undefined)
      
      if (monthData.length === 0) {
        console.warn('回访统计数据为空，使用默认数据')
        render(last12Months())
        return
      }
      
      // 创建月份数据映射，方便查找
      const dataMap = {}
      monthData.forEach(item => {
        if (item && item.month) {
          const date = new Date(item.month)
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`
          dataMap[key] = item
        }
      })
      
      // 只取近 12 个月的数据
      const months = targetMonths.map(m => m.label)
      followupData.value.phone = targetMonths.map(m => {
        const key = `${m.year}-${m.month}`
        const item = dataMap[key]
        const val = item ? (item.phone !== null && item.phone !== undefined ? item.phone : 0) : 0
        return parseInt(val) || 0
      })
      followupData.value.wechat = targetMonths.map(m => {
        const key = `${m.year}-${m.month}`
        const item = dataMap[key]
        const val = item ? (item.wechat !== null && item.wechat !== undefined ? item.wechat : 0) : 0
        return parseInt(val) || 0
      })
      followupData.value.outpatient = targetMonths.map(m => {
        const key = `${m.year}-${m.month}`
        const item = dataMap[key]
        const val = item ? (item.outpatient !== null && item.outpatient !== undefined ? item.outpatient : 0) : 0
        return parseInt(val) || 0
      })
      followupData.value.video = targetMonths.map(m => {
        const key = `${m.year}-${m.month}`
        const item = dataMap[key]
        const val = item ? (item.video !== null && item.video !== undefined ? item.video : 0) : 0
        return parseInt(val) || 0
      })
      
      render(months)
    } else {
      console.warn('回访统计数据格式异常，使用默认数据')
      render(last12Months())
    }
  } catch (error) {
    console.error("获取回访统计数据失败:", error)
    render(last12Months())
  }
}

function render(months = last12Months()) {
  chart = echarts.init(el.value)
  chart.setOption({
    grid: { left: 40, right: 20, top: 40, bottom: 28 },
    xAxis: {
      type: "category",
      data: months,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#fff" } },
      axisLabel: { 
        color: "#fff", 
        interval: 0,
        rotate: 0
      },
      axisTick: { 
        show: true, 
        alignWithLabel: true,
        interval: 0
      },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#fff" } },
      axisLabel: { color: "#fff" },
      splitLine: { lineStyle: { type: "dashed", color: "rgba(255,255,255,0.25)" } },
    },
    legend: { 
      data: ["电话回访", "微信回访", "门诊回访", "视频回访"], 
      textStyle: { color: "#FFFFFF" }, 
      top: 6, 
      right: 10 
    },
    series: [
      {
        name: "电话回访",
        type: "line",
        data: followupData.value.phone,
        smooth: true,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#ffffff",
          borderColor: "#3bdcff",
          borderWidth: 2,
          shadowBlur: 4,
          shadowColor: "rgba(59,220,255,0.35)",
        },
        lineStyle: { color: "#3bdcff", width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(59,220,255,0.35)" },
            { offset: 1, color: "rgba(59,220,255,0.0)" },
          ]),
        },
      },
      {
        name: "微信回访",
        type: "line",
        data: followupData.value.wechat,
        smooth: true,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#ffffff",
          borderColor: "#ffaf3b",
          borderWidth: 2,
          shadowBlur: 4,
          shadowColor: "rgba(255,175,59,0.35)",
        },
        lineStyle: { color: "#ffaf3b", width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255,175,59,0.35)" },
            { offset: 1, color: "rgba(255,175,59,0.0)" },
          ]),
        },
      },
      {
        name: "门诊回访",
        type: "line",
        data: followupData.value.outpatient,
        smooth: true,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#ffffff",
          borderColor: "#4ade80",
          borderWidth: 2,
          shadowBlur: 4,
          shadowColor: "rgba(74,222,128,0.35)",
        },
        lineStyle: { color: "#4ade80", width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(74,222,128,0.35)" },
            { offset: 1, color: "rgba(74,222,128,0.0)" },
          ]),
        },
      },
      {
        name: "视频回访",
        type: "line",
        data: followupData.value.video,
        smooth: true,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#ffffff",
          borderColor: "#f472b6",
          borderWidth: 2,
          shadowBlur: 4,
          shadowColor: "rgba(244,114,182,0.35)",
        },
        lineStyle: { color: "#f472b6", width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(244,114,182,0.35)" },
            { offset: 1, color: "rgba(244,114,182,0.0)" },
          ]),
        },
      },
    ],
    tooltip: { trigger: "axis" },
  })
}

onMounted(() => {
  fetchFollowupStats()
})

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose()
  }
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
