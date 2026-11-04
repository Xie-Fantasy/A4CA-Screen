<template>
  <PanelContainer title="回访统计分析">
    <div ref="el" class="chart"></div>
  </PanelContainer>
</template>

<script setup>
import * as echarts from "echarts"
import { onMounted, onBeforeUnmount, ref } from "vue"
import PanelContainer from "../PanelContainer.vue"
// import { getFollowupStatsByQuarter } from "@/api/dashboard"
import mockData from '@/api/mockData'

const el = ref(null)
let chart = null
const quarters = ref([])
const taskCounts = ref([])
const completedCounts = ref([])

// 计算当前季度往前推 6 个季度
function getLast6Quarters() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-12
  // 计算当前季度 (1-4)
  let currentQuarter = Math.ceil(currentMonth / 3)
  let year = currentYear
  
  const result = []
  for (let i = 5; i >= 0; i--) {
    let q = currentQuarter - i
    let y = year
    while (q <= 0) {
      q += 4
      y -= 1
    }
    result.push(`${y}/Q${q}`)
  }
  return result
}

// 获取回访统计数据（当前使用静态假数据）
async function fetchData() {
  try {
    // const res = await getFollowupStatsByQuarter()
    const res = mockData.getFollowupStatsByQuarter
    console.log('回访统计数据:', res)
    if (res && res.code === 200 && res.data && Array.isArray(res.data)) {
      // 获取所有 6 个季度的完整列表
      const allQuarters = getLast6Quarters()
      console.log('完整的 6 个季度:', allQuarters)
      
      // 从后端获取季度数据
      const backendData = res.data
      console.log('后端返回的数据:', backendData)
      
      // 填充数据，确保 6 个季度都有数据（没有数据的季度补 0）
      quarters.value = allQuarters
      taskCounts.value = allQuarters.map(q => {
        const item = backendData.find(d => d.quarter === q)
        return item ? item.taskCount : 0
      })
      completedCounts.value = allQuarters.map(q => {
        const item = backendData.find(d => d.quarter === q)
        return item ? item.completedCount : 0
      })
      
      console.log('填充后的数据:')
      console.log('季度:', quarters.value)
      console.log('回访人次:', taskCounts.value)
      console.log('已完成:', completedCounts.value)
      
      // 数据加载完成后渲染图表
      render()
    } else {
      console.warn('回访统计数据格式异常，使用默认数据')
      useDefaultData()
      render()
    }
  } catch (error) {
    console.error("获取回访统计数据失败:", error)
    useDefaultData()
    render()
  }
}

// 使用默认数据
function useDefaultData() {
  quarters.value = getLast6Quarters()
  taskCounts.value = [0, 0, 0, 0, 0, 0]
  completedCounts.value = [0, 0, 0, 0, 0, 0]
}

function render() {
  if (!el.value) return
  chart = echarts.init(el.value)
  chart.setOption({
    grid: { left: 40, right: 40, top: 48, bottom: 24 },
    xAxis: {
      type: "category",
      data: quarters.value,
      axisLine: { lineStyle: { color: "#fff" } },
      axisLabel: { color: "#fff", fontSize: 10, interval: 0 },
      axisTick: { show: true, alignWithLabel: true },
    },
    yAxis: [
      {
        type: "value",
        name: "人次",
        nameTextStyle: { color: "#fff", fontSize: 11 },
        axisLine: { lineStyle: { color: "#fff" } },
        axisLabel: { color: "#fff", fontSize: 10 },
        splitLine: { lineStyle: { type: "dashed", color: "rgba(255,255,255,0.25)" } },
      },
      {
        type: "value",
        name: "完成率",
        nameTextStyle: { color: "#fff", fontSize: 11 },
        axisLine: { lineStyle: { color: "#fff" } },
        axisLabel: { 
          color: "#fff", 
          fontSize: 10,
          formatter: (value) => value + '%'
        },
        splitLine: { show: false },
      },
    ],
    legend: { 
      data: ["回访人次", "完成率"], 
      top: 10, 
      left: 'center',
      textStyle: { color: "#FFFFFF", fontSize: 11 } 
    },
    series: [
      // 3D 风格渐变柱 - 回访人次
      {
        name: "回访人次",
        type: "bar",
        data: taskCounts.value,
        yAxisIndex: 0,
        barMaxWidth: 26,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#7beaff" },
            { offset: 0.4, color: "#28b9f0" },
            { offset: 1, color: "#0b6fd0" },
          ]),
          shadowColor: "rgba(0,0,0,0.35)",
          shadowBlur: 8,
          shadowOffsetY: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
          },
        },
        z: 5,
      },
      // 3D 侧面高光叠加
      {
        type: "bar",
        data: taskCounts.value,
        yAxisIndex: 0,
        barMaxWidth: 26,
        barGap: "-100%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "rgba(255,255,255,0.35)" },
            { offset: 0.5, color: "rgba(56, 198, 255, 0.15)" },
            { offset: 1, color: "rgba(11,111,208,0.0)" },
          ]),
        },
        silent: true,
        tooltip: { show: false },
        z: 6,
      },
      // 顶部高光帽
      {
        type: "pictorialBar",
        data: taskCounts.value,
        yAxisIndex: 0,
        symbol: "diamond",
        symbolSize: [26, 10],
        symbolOffset: [0, -6],
        symbolPosition: "end",
        itemStyle: { color: "#bff8ff" },
        silent: true,
        tooltip: { show: false },
        z: 7,
      },
      // 发光折线 - 完成率
      {
        name: "完成率",
        type: "line",
        data: completedCounts.value.map((count, idx) => {
          const total = taskCounts.value[idx]
          return total > 0 ? ((count / total) * 100).toFixed(1) : 0
        }),
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: "#ffffff",
          borderColor: "#ffd65a",
          borderWidth: 2,
          shadowColor: "rgba(255,214,90,0.6)",
          shadowBlur: 6,
        },
        lineStyle: {
          color: "#ffd65a",
          width: 2,
          shadowColor: "rgba(255,214,90,0.55)",
          shadowBlur: 10,
        },
        z: 10,
        zlevel: 1,
      },
    ],
    tooltip: { 
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const quarter = params[0].name
        const taskCount = params[0].value
        const rate = params[1].value
        return `${quarter}<br/>回访人次：${taskCount}<br/>完成率：${rate}%`
      }
    },
    textStyle: { color: "#FFFFFF" },
  })
}

onMounted(() => {
  fetchData()
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
