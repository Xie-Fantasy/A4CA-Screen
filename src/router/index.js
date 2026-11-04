import { createRouter, createWebHistory } from 'vue-router'
import MapAnimate from '@/views/map-animate/map.vue'

// 使用 Vite 注入的 BASE_URL，确保在设置了 base:'/sayhello-site/' 时路由正常解析
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: MapAnimate }
  ]
})

export default router
