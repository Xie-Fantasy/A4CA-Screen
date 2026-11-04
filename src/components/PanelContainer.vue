<template>
  <div class="panel-container">
    <div class="panel-header">
      <img :src="titleBg" alt="title-bg" class="title-bg" />
      <span class="panel-title">{{ title }}</span>
    </div>
    <div class="panel-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import defaultTitleBg from "@/assets/screen-img/title-4eee5910.png"
const props = defineProps({
  title: { type: String, default: "标题" },
  titleBg: { type: String, default: defaultTitleBg },
})
</script>

<style scoped>
.panel-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 43px; /* 36 * 1.20 */
  box-sizing: border-box;
}
.panel-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 36px; /* 30 * 1.20 */
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.title-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 36px;
  object-fit: cover;
  opacity: 0.95;
}
.panel-title {
  position: relative;
  margin-left: 19px; /* 16 * 1.20 */
  height: 36px;
  line-height: 36px;
  font-size: 19px; /* 16 * 1.20 */
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(rgb(219, 249, 255), rgb(169, 240, 255));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  z-index: 1;
}
.panel-body {
  width: 100%;
  height: calc(100% - 34px); /* 28 * 1.20 ≈ 33.6 */
  background: transparent;
  border: none;
  box-shadow: none;
}
</style>

