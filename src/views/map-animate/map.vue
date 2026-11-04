<template>
  <div class="map-level">
    <canvas id="canvas"></canvas>
    <div class="return-btn" @click="goBack">返回上一级</div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, reactive, nextTick } from "vue"
import { World } from "./map"

let app = null

const state = reactive({
  bar: true, // 柱状图
  flyLine: false, // 飞线
  scatter: false, // 散点图
  card: false, // 标牌
  particle: true, // 粒子默认开启
  mirror: true, // 倒影默认开启
  path: false, // 路径轨迹
})
const setEffectToggle = (type) => {
  console.log(app.currentScene)
  if (["bar", "flyLine", "scatter", "card", "path"].includes(type) && app && app.currentScene === "childScene") {
    return false
  }
  // 设置按钮状态
  state[type] = !state[type]

  if (type === "bar") {
    app.barGroup.visible = state[type]
    app.setLabelVisible("labelGroup", state[type])
  }
  if (type === "particle") {
    app.particles.enable = state[type]
    app.particles.instance.visible = state[type]
  }
  if (type === "flyLine") {
    app.flyLineGroup.visible = state[type]
    app.flyLineFocusGroup.visible = state[type]
  }
  if (type === "scatter") {
    app.scatterGroup.visible = state[type]
  }
  if (type === "card") {
    app.setLabelVisible("badgeGroup", state[type])
  }
  if (type === "mirror") {
    app.groundMirror.visible = state[type]
  }
  if (type === "path") {
    app.pathLineGroup.visible = state[type]
  }
}
// 设置按钮启用和禁用
const setEnable = (bool) => {
  state.bar = bool
  state.flyLine = bool
  state.scatter = bool
  state.card = bool
  state.path = bool
}
// 返回上一级
const goBack = () => {
  app && app.goBack()
}

onMounted(() => {
  app = new World(document.getElementById("canvas"), {
    geoProjectionCenter: [108.55, 34.32],
    setEnable: setEnable,
    useContainerSize: true, // 使用容器尺寸，支持大屏缩放
  })
  nextTick(() => {
    if (!app) return
    // 根据默认状态启用效果
    if (state.bar) {
      app.barGroup && (app.barGroup.visible = true)
      app.setLabelVisible && app.setLabelVisible("labelGroup", true)
    }
    if (state.particle) {
      if (app.particles) {
        app.particles.enable = true
        app.particles.instance.visible = true
      }
    }
    if (state.mirror) {
      app.groundMirror && (app.groundMirror.visible = true)
    }
  })
})
onBeforeUnmount(() => {
  app && app.destroy()
})
</script>

<style lang="scss">
.map-level {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  #canvas {
    width: 100%;
    height: 100%;
    background: transparent;
  }
}

// 返回按钮
.return-btn {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  padding: 5px 24px;
  color: #fff;
  border: 1px solid #2bc4dc;
  margin-bottom: 10px;
  font-size: 12px;
  text-align: center;
  opacity: 0.5;
  display: none;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
  }
}

// 右侧按钮组
/* 右侧功能选择模块已移除 */
// 信息框
.info-point {
  background: rgba(0, 0, 0, 0.5);
  color: #a3dcde;
  font-size: 14px;
  width: 170px;
  height: 106px;
  padding: 16px 12px 0;
  margin-bottom: 30px;
  &-wrap {
    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      top: 0;
      width: 15px;
      height: 15px;
      border-top: 1px solid #4b87a6;
    }
    &:before {
      left: 0;
      border-left: 1px solid #4b87a6;
    }
    &:after {
      right: 0;
      border-right: 1px solid #4b87a6;
    }
    &-inner {
      &:after,
      &:before {
        display: block;
        content: "";
        position: absolute;
        bottom: 0;
        width: 15px;
        height: 15px;
        border-bottom: 1px solid #4b87a6;
      }
      &:before {
        left: 0;
        border-left: 1px solid #4b87a6;
      }
      &:after {
        right: 0;
        border-right: 1px solid #4b87a6;
      }
    }
  }
  &-line {
    position: absolute;
    top: 7px;
    right: 12px;
    display: flex;
    .line {
      width: 5px;
      height: 2px;
      margin-right: 5px;
      background: #17e5c3;
    }
  }
  &-content {
    .content-item {
      display: flex;
      height: 28px;
      line-height: 28px;
      background: rgba(35, 47, 58, 0.6);
      margin-bottom: 5px;
      .label {
        width: 60px;
        padding-left: 10px;
      }
      .value {
        color: #fff;
      }
    }
  }
}
// 标牌
.badges-label {
  z-index: 99999;
  &-outline {
    position: absolute;
  }
  &-wrap {
    position: relative;
    padding: 10px 10px;
    background: #0e1937;
    border: 1px solid #1e7491;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    // margin-bottom: 50px;
    bottom: 50px;
    z-index: 99999;
    span {
      color: #ffe70b;
    }
    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 10px;
      height: 10px;
      display: block;
      content: "";
      border-right: 2px solid #6cfffe;
      border-bottom: 2px solid #6cfffe;
    }
    &:before {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 10px;
      height: 10px;
      display: block;
      content: "";
      border-left: 2px solid #6cfffe;
      border-bottom: 2px solid #6cfffe;
    }
    .icon {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -16px;
      width: 15px;
      height: 16px;
    }
  }
  &-wrap::after {
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    height: 10px;
    display: block;
    content: "";
    border-right: 2px solid #6cfffe;
    border-top: 2px solid #6cfffe;
  }
  &-wrap::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 10px;
    display: block;
    content: "";
    border-left: 2px solid #6cfffe;
    border-top: 2px solid #6cfffe;
  }
}

// 省份名称标注
.provinces-name-label {
  color: rgb(156, 252, 255);
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

// 省份标注
.province-label {
  color: rgb(156, 252, 255);
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

// 人口标签
.provinces-label-style02 {
  color: rgb(156, 252, 255);
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
  .number {
    color: rgb(156, 252, 255);
    .value {
      color: rgb(156, 252, 255);
    }
    .unit {
      color: rgb(156, 252, 255);
    }
  }
  &.yellow {
    color: #ffe70b;
    .number {
      color: #ffe70b;
      .value {
        color: #ffe70b;
      }
    }
  }
}
</style>
