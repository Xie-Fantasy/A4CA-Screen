<template>
  <!-- 背景层 -->
  <div class="screen-bg"></div>

  <!-- 隐藏的按钮用于触发全屏 -->
  <button ref="fullscreenBtn" class="fullscreen-trigger" @click="enterFullscreen">全屏</button>

  <!-- 缩放容器 -->
  <div class="screen-container" :style="containerStyle">
    <!-- 顶部大标题 -->
    <div class="screen-header">
      <div class="header-title">MCE AI+ 可视化平台</div>
    </div>

    <!-- 地图主体 -->
    <MapAnimate />

    <!-- 左右侧图表面板 -->
    <div class="panels">
      <div class="left">
        <ServiceOverview />
        <NursingServiceLine />
        <ProjectAnalysisPie />
      </div>
      <div class="right">
        <ElectronicPrescription />
        <TypeRanking />
        <UserPortrait />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MapAnimate from '@/views/map-animate/map.vue'
import ServiceOverview from '@/components/charts/ServiceOverview.vue'
import NursingServiceLine from '@/components/charts/NursingServiceLine.vue'
import ProjectAnalysisPie from '@/components/charts/ProjectAnalysisPie.vue'
import ElectronicPrescription from '@/components/charts/ElectronicPrescription.vue'
import TypeRanking from '@/components/charts/TypeRanking.vue'
import UserPortrait from '@/components/charts/UserPortrait.vue'
import { getScaleStyle, onScreenResize } from '@/utils/screenAdapter'

// 容器样式
const containerStyle = ref({})

// 全屏按钮引用
const fullscreenBtn = ref(null)

// 取消监听函数
let unsubscribe = null

// 进入全屏
function enterFullscreen() {
  const doc = document.documentElement
  if (doc.requestFullscreen) {
    doc.requestFullscreen().catch(err => {
      console.log('全屏请求被拒绝:', err)
    })
  } else if (doc.webkitRequestFullscreen) {
    doc.webkitRequestFullscreen()
  } else if (doc.mozRequestFullScreen) {
    doc.mozRequestFullScreen()
  } else if (doc.msRequestFullscreen) {
    doc.msRequestFullscreen()
  }
}

onMounted(() => {
  // 初始化样式
  containerStyle.value = getScaleStyle()

  // 监听屏幕变化
  unsubscribe = onScreenResize(() => {
    containerStyle.value = getScaleStyle()
  })

  // 监听全屏变化事件，延迟更新以确保尺寸正确
  const handleFullscreenChange = () => {
    // 延迟 100ms 等待浏览器完成全屏切换
    setTimeout(() => {
      containerStyle.value = getScaleStyle()
    }, 100)
  }

  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)

  // 页面加载后自动触发隐藏按钮的点击事件进入全屏
  setTimeout(() => {
    if (fullscreenBtn.value && !document.fullscreenElement) {
      fullscreenBtn.value.click()
    }
  }, 100)

  // 保存引用以便卸载
  unsubscribe = () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 隐藏的全屏触发按钮 */
.fullscreen-trigger {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

/* 背景层 - 使用背景图铺满 */
.screen-bg {
  position: absolute;
  inset: 0;
  background: url('@/assets/screen-img/background.png') center center / cover no-repeat;
  z-index: 0;
}

/* 缩放容器 - 以 1920x1080 为基准 */
.screen-container {
  position: absolute;
  width: 1920px;
  height: 1080px;
  transform-origin: top left;
  z-index: 1;
}

.screen-header {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: none;
}

.header-title {
  position: relative;
  font-weight: 800;
  font-size: 30px;
  font-style: italic;
  letter-spacing: 2px;
  background: linear-gradient(#dbf9ff, #a9f0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 8px rgba(121, 232, 255, 0.35);
}

.panels {
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 12px;
  box-sizing: border-box;
  pointer-events: none;
}

.left, .right {
  display: grid;
  grid-template-rows: 320px 320px 320px;
  row-gap: 12px;
  width: 440px;
}

.left > *, .right > * {
  pointer-events: auto;
}
</style>
