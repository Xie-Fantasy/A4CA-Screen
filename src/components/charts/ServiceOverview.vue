<template>
  <PanelContainer title="部门概况">
    <div class="overview-grid">
      <div v-for="it in items" :key="it.label" class="item" :style="{ backgroundImage: `url(${itemBg})` }">
        <div class="icon-wrap"><img :src="it.icon" class="icon" /></div>
        <div class="label">{{ it.label }}</div>
        <div class="value">{{ it.value }}</div>
      </div>
    </div>
  </PanelContainer>
</template>

<script setup>
import PanelContainer from "../PanelContainer.vue"
import itemBg from "@/assets/screen-img/项目概况背景.png"
import iconGongDan from "@/assets/screen-img/服务工单.png"
import iconRenShu from "@/assets/screen-img/服务人数.png"
import iconYiSheng from "@/assets/screen-img/入驻护士.png"
import iconJiGou from "@/assets/screen-img/入驻机构.png"
// import { getUserCount, getExamCount, getPatientCount, getFollowupTaskCount } from "@/api/dashboard"
import mockData from '@/api/mockData'
import { ref, onMounted } from "vue"

const items = ref([
  { label: "回访数量", value: "0", icon: iconGongDan },
  { label: "执业医师数", value: "0", icon: iconYiSheng },
  { label: "累计检查人次", value: "0", icon: iconRenShu },
  { label: "服务患者数", value: "0", icon: iconJiGou },
])

// 获取真实数据（当前使用静态假数据）
async function fetchDashboardData() {
  try {
    // // 获取回访任务数
    // const followupRes = await getFollowupTaskCount()
    const followupRes = mockData.getFollowupTaskCount
    console.log('回访任务数据:', followupRes)
    if (followupRes && followupRes.code === 200 && followupRes.data && followupRes.data.total !== undefined) {
      items.value[0].value = followupRes.data.total.toLocaleString()
    }
    
    // // 获取用户数（执业医师数）
    // const userRes = await getUserCount()
    const userRes = mockData.getUserCount
    console.log('用户数据:', userRes)
    if (userRes && userRes.code === 200 && userRes.data && userRes.data.total !== undefined) {
      items.value[1].value = userRes.data.total.toLocaleString()
    }
    
    // // 获取检查数（累计检查人次）
    // const examRes = await getExamCount()
    const examRes = mockData.getExamCount
    console.log('检查数据:', examRes)
    if (examRes && examRes.code === 200 && examRes.data && examRes.data.total !== undefined) {
      items.value[2].value = examRes.data.total.toLocaleString()
    }
    
    // // 获取患者数（服务患者数）
    // const patientRes = await getPatientCount()
    const patientRes = mockData.getPatientCount
    console.log('患者数据:', patientRes)
    if (patientRes && patientRes.code === 200 && patientRes.data && patientRes.data.total !== undefined) {
      items.value[3].value = patientRes.data.total.toLocaleString()
    }
  } catch (error) {
    console.error("获取部门概况数据失败:", error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.overview-grid {
  width: 388px; /* 323 * 1.20 */
  display: grid;
  grid-template-columns: 186px 186px; /* 155 * 1.20 */
  grid-template-rows: 88px 88px; /* 73 * 1.20 */
  column-gap: 16px; /* 13 * 1.20 ≈ 15.6 */
  row-gap: 16px;
  margin-top: 7px; /* 6 * 1.20 ≈ 7.2 */
}
.item {
  width: 186px;
  height: 88px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.icon-wrap {
  position: absolute;
  left: 13px; /* 11 * 1.20 ≈ 13.2 */
  top: 50%;
  transform: translateY(-50%);
  width: 53px; /* 44 * 1.20 */
  height: 53px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon {
  width: 31px; /* 26 * 1.20 */
  height: 31px;
}
.label {
  position: absolute;
  left: 76px; /* 63 * 1.20 */
  top: 12px; /* 10 * 1.20 */
  font-size: 17px; /* 14 * 1.20 ≈ 16.8 */
  color: #ffffff;
}
.value {
  position: absolute;
  left: 76px;
  bottom: 10px; /* 8 * 1.20 ≈ 9.6 */
  font-size: 26px; /* 22 * 1.20 */
  font-weight: 700;
  color: #ffd65a;
  text-shadow: 0 0 6px rgba(255, 214, 90, 0.6);
}
</style>
