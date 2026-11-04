<template>
  <PanelContainer title="城市患者分布">
    <div class="rank-container">
      <div class="rank-item" v-for="(item, index) in rankData" :key="item.cityCode">
        <div class="rank-badge" :class="`rank-${index + 1}`">
          <span class="rank-text">Top {{ index + 1 }}</span>
        </div>
        <div class="rank-bar-container">
          <div class="rank-name" :title="item.cityName">{{ item.cityName }}</div>
          <div class="rank-bar-wrapper">
            <div class="rank-bar-bg">
              <div 
                class="rank-bar-fill" 
                :class="`rank-bar-${index + 1}`"
                :style="{ width: item.percent + '%' }"
              ></div>
              <div class="rank-bar-tick" :style="{ left: item.percent + '%' }"></div>
            </div>
          </div>
          <div class="rank-value">{{ item.value.toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </PanelContainer>
</template>

<script setup>
import PanelContainer from "../PanelContainer.vue"
import { ref, onMounted } from 'vue'
// import { getCityStats } from '@/api/screen'
import mockData from '@/api/mockData'
import { getCityName } from '@/utils/cityMap'

const rankData = ref([])

// 加载数据（当前使用静态假数据）
const loadData = async () => {
  try {
    // const response = await getCityStats()
    const response = mockData.getCityStats
    const data = response.data || []
    
    console.log('后端返回的原始数据:', JSON.stringify(data, null, 2))
    
    // 处理数据，按数量排序并取前 5 名
    const sortedData = data
      .map(item => {
        // 兼容所有可能的字段名
        const code = item.cityCode || item.city_code || item.CITY_CODE || 
                     item.city || item.cityName || item.name || 
                     item.code || ''
        const cityName = getCityName(String(code))
        console.log(`原始数据项:`, item, `=> 提取代码: ${code}, 转换名称: ${cityName}`)
        return {
          cityCode: code,
          cityName: cityName,
          value: item.value || 0
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
    
    console.log('排序后的数据:', sortedData)
    
    // 计算百分比
    const maxValue = Math.max(...sortedData.map(item => item.value))
    rankData.value = sortedData.map(item => ({
      ...item,
      percent: maxValue > 0 ? (item.value / maxValue * 100) : 0
    }))
  } catch (error) {
    console.error('获取城市数据失败:', error)
    // 使用模拟数据
    const mockData = [
      { cityCode: '330200', cityName: '宁波市', value: 299473 },
      { cityCode: '330400', cityName: '嘉兴市', value: 181340 },
      { cityCode: '330700', cityName: '金华市', value: 126162 },
      { cityCode: '330100', cityName: '杭州市', value: 120583 },
      { cityCode: '330300', cityName: '温州市', value: 11543 }
    ]
    
    const maxValue = Math.max(...mockData.map(item => item.value))
    rankData.value = mockData.map(item => ({
      ...item,
      percent: (item.value / maxValue * 100)
    }))
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.rank-container {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: center;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
}

.rank-badge {
  flex-shrink: 0;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);
}

.rank-1 {
  background: linear-gradient(90deg, rgba(255, 189, 115, 0.8), rgba(255, 140, 0, 0.8));
}

.rank-2 {
  background: linear-gradient(90deg, rgba(139, 198, 255, 0.8), rgba(21, 127, 255, 0.8));
}

.rank-3 {
  background: linear-gradient(90deg, rgba(108, 250, 255, 0.8), rgba(40, 210, 199, 0.8));
}

.rank-4 {
  background: linear-gradient(90deg, rgba(180, 160, 255, 0.7), rgba(120, 100, 230, 0.7));
}

.rank-5 {
  background: linear-gradient(90deg, rgba(255, 160, 200, 0.7), rgba(255, 100, 150, 0.7));
}

.rank-text {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.rank-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.rank-name {
  flex-shrink: 0;
  width: 65px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-bar-wrapper {
  flex: 1;
  min-width: 0;
}

.rank-bar-bg {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  overflow: visible;
}

.rank-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.rank-bar-1 {
  background: linear-gradient(90deg, rgba(255, 227, 138, 0.7) 0%, rgba(255, 159, 45, 0.7) 100%);
}

.rank-bar-2 {
  background: linear-gradient(90deg, rgba(208, 238, 255, 0.7) 0%, rgba(21, 127, 255, 0.7) 100%);
}

.rank-bar-3 {
  background: linear-gradient(90deg, rgba(168, 250, 255, 0.7) 0%, rgba(40, 210, 199, 0.7) 100%);
}

.rank-bar-4 {
  background: linear-gradient(90deg, rgba(220, 200, 255, 0.6) 0%, rgba(140, 120, 240, 0.6) 100%);
}

.rank-bar-5 {
  background: linear-gradient(90deg, rgba(255, 200, 220, 0.6) 0%, rgba(255, 120, 160, 0.6) 100%);
}

.rank-bar-tick {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
  border-radius: 1px;
  transform: translateX(-50%);
}

.rank-value {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  min-width: 50px;
}
</style>
