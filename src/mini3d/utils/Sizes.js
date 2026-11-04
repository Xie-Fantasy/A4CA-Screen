import { EventEmitter } from "./EventEmitter"

export class Sizes extends EventEmitter {
  constructor({ canvas, useContainerSize = false }) {
    super()
    this.canvas = canvas
    this.useContainerSize = useContainerSize
    this.pixelRatio = 0
    this.init()
    window.addEventListener("resize", () => {
      this.init()
      this.emit("resize")
    })
  }
  init() {
    // 如果使用容器尺寸（大屏缩放模式），获取 canvas 父容器尺寸
    if (this.useContainerSize && this.canvas && this.canvas.parentElement) {
      // 使用 clientWidth/clientHeight 获取逻辑像素，避免缩放影响
      this.width = this.canvas.parentElement.clientWidth
      this.height = this.canvas.parentElement.clientHeight
    } else {
      // 默认使用窗口尺寸
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
    this.pixelRatio = this.pixelRatio || Math.min(window.devicePixelRatio, 2)
  }
  destroy() {
    this.off("resize")
  }
}
