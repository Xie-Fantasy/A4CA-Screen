<template>
  <PanelContainer title="患者画像">
    <div class="portrait">
      <div class="legend">
        <span class="dot male"></span> 男
        <span class="dot female"></span> 女
      </div>
      <div class="ytitle">年龄段（岁）</div>
      <div class="list">
        <div class="row" v-for="seg in segmentsAsc" :key="seg.label">
          <div class="label">{{ seg.label }}</div>
          <div class="pct male">{{ seg.male.toFixed(1) }}%</div>
          <div class="bars">
            <div class="bar-bg"></div>
            <!-- 从中间向两侧延伸 -->
            <div class="bar male" :style="{ width: maleWidth(seg) }"></div>
            <div class="bar female" :style="{ width: femaleWidth(seg) }"></div>
          </div>
          <div class="pct female">{{ seg.female.toFixed(1) }}%</div>
        </div>
      </div>
    </div>
  </PanelContainer>
</template>

<script setup>
import PanelContainer from "../PanelContainer.vue"
// import { getUserPortrait } from "@/api/dashboard"
import mockData from '@/api/mockData'
import { ref, onMounted } from "vue"

const segmentsAsc = ref([])

// 获取用户画像数据（当前使用静态假数据）
async function fetchUserPortrait() {
  try {
    // const res = await getUserPortrait()
    const res = mockData.getUserPortrait
    console.log('用户画像数据:', res)
    if (res && res.code === 200 && res.data && Array.isArray(res.data)) {
      // 确保数据按正确顺序排列
      const order = ["0-12 岁", "12-18 岁", "18-44 岁", "45-59 岁", "60-74 岁", "75 岁以上"]
      const sortedData = order.map(label => {
        const item = res.data.find(d => d.label === label)
        return item || { label, male: 0, female: 0 }
      })
      segmentsAsc.value = sortedData
    } else {
      console.warn('用户画像数据格式异常，使用默认数据')
      useDefaultData()
    }
  } catch (error) {
    console.error("获取用户画像失败:", error)
    useDefaultData()
  }
}

// 使用默认数据
function useDefaultData() {
  segmentsAsc.value = [
    { label: "0-12 岁", male: 8.0, female: 7.5 },
    { label: "12-18 岁", male: 6.0, female: 5.5 },
    { label: "18-44 岁", male: 18.0, female: 20.0 },
    { label: "45-59 岁", male: 15.0, female: 17.0 },
    { label: "60-74 岁", male: 12.0, female: 14.0 },
    { label: "75 岁以上", male: 5.0, female: 6.0 },
  ]
}

// bars 容器宽度为 120px，每侧最大 60px
// 计算每侧的百分比宽度（基于该年龄段总人数），最大 48%
const maleWidth = (seg) => {
  const total = seg.male + seg.female
  if (total === 0) return '0%'
  const ratio = seg.male / total
  return `${Math.min(ratio * 48, 48).toFixed(2)}%`
}
const femaleWidth = (seg) => {
  const total = seg.male + seg.female
  if (total === 0) return '0%'
  const ratio = seg.female / total
  return `${Math.min(ratio * 48, 48).toFixed(2)}%`
}

onMounted(() => {
  fetchUserPortrait()
})
</script>

<style scoped>
.portrait { 
  position: relative; 
  height: 100%; 
  padding: 24px 12px 10px; 
  overflow: hidden;
}
.legend { 
  position: absolute; 
  top: 2px; 
  right: 10px; 
  color: #fff; 
  font-size: 12px; 
  display: flex; 
  gap: 8px; 
  align-items: center; 
  z-index: 2; 
}
.ytitle { 
  position: absolute; 
  top: 2px; 
  left: 12px; 
  color: rgba(255,255,255,0.9); 
  font-size: 12px; 
  z-index: 2;
}
.dot { 
  width: 10px; 
  height: 10px; 
  border-radius: 50%; 
  display: inline-block; 
  margin-right: 4px; 
}
.dot.male { 
  background: linear-gradient(90deg, rgba(59,220,255,0.9), rgba(21,127,255,0.9)); 
}
.dot.female { 
  background: linear-gradient(90deg, rgba(255,175,59,0.9), rgba(255,122,26,0.9)); 
}

.list { 
  height: calc(100% - 20px); 
  display: flex; 
  flex-direction: column-reverse; 
  justify-content: space-between; 
  gap: 6px;
  padding-top: 20px;
}
.row { 
  display: grid; 
  grid-template-columns: 80px 45px 1fr 45px; 
  align-items: center; 
  column-gap: 8px;
  position: relative;
  width: 100%;
}
.label { 
  color: rgba(255,255,255,0.9); 
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bars { 
  position: relative; 
  width: 100%;
  height: 8px; 
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: visible;
}
.bar-bg { 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
  border-radius: 4px;
}
.bar { 
  position: absolute; 
  height: 100%; 
  box-shadow: none;
  border-radius: 4px;
  transition: width 0.3s ease;
}
/* 男左侧：从中心向左延伸 */
.bar.male { 
  right: 50%; 
  background: linear-gradient(90deg, rgba(59,220,255,0.95), rgba(21,127,255,0.65));
}
/* 女右侧：从中心向右延伸 */
.bar.female { 
  left: 50%; 
  background: linear-gradient(90deg, rgba(255,175,59,0.95), rgba(255,122,26,0.65));
}
.center-line { 
  display: none; 
}
.pct { 
  font-size: 11px; 
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
  font-weight: 500;
}
.pct.male { 
  text-align: right; 
  color: #7fdfff;
  padding-right: 2px;
}
.pct.female { 
  text-align: left; 
  color: #ffaf7a;
  padding-left: 2px;
}
</style>
