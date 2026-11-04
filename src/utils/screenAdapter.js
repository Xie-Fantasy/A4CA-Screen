/**
 * 大屏自适应缩放工具
 * 以 1920x1080 为设计基准，等比例缩放适配各种屏幕
 */

// 设计稿尺寸
const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

/**
 * 获取屏幕缩放比例
 * @returns {Object} { scale, width, height }
 */
export function getScreenScale() {
  const width = window.innerWidth
  const height = window.innerHeight

  // 计算宽高比，保持设计稿比例
  const scaleX = width / DESIGN_WIDTH
  const scaleY = height / DESIGN_HEIGHT

  // 取较小值，确保内容完整显示
  const scale = Math.min(scaleX, scaleY)

  return {
    scale,
    width,
    height,
    designWidth: DESIGN_WIDTH,
    designHeight: DESIGN_HEIGHT
  }
}

/**
 * 计算缩放后的样式
 * @returns {Object} CSS 样式对象
 */
export function getScaleStyle() {
  const { scale, width, height } = getScreenScale()

  // 计算居中偏移
  const scaledWidth = DESIGN_WIDTH * scale
  const scaledHeight = DESIGN_HEIGHT * scale
  const offsetX = (width - scaledWidth) / 2
  const offsetY = (height - scaledHeight) / 2

  return {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${DESIGN_WIDTH}px`,
    height: `${DESIGN_HEIGHT}px`,
    position: 'absolute',
    left: `${offsetX}px`,
    top: `${offsetY}px`,
    boxSizing: 'border-box'
  }
}

/**
 * 监听屏幕尺寸变化
 * @param {Function} callback 回调函数，接收 scale 信息
 * @returns {Function} 取消监听函数
 */
export function onScreenResize(callback) {
  const handler = () => {
    callback(getScreenScale())
  }

  window.addEventListener('resize', handler)

  // 立即执行一次
  handler()

  // 返回取消监听函数
  return () => {
    window.removeEventListener('resize', handler)
  }
}

/**
 * 将像素值转换为缩放后的值（用于动态计算）
 * @param {number} px 设计稿像素值
 * @returns {number} 缩放后的像素值
 */
export function toScalePx(px) {
  const { scale } = getScreenScale()
  return px * scale
}

/**
 * 反向计算：从实际像素反推设计稿像素
 * @param {number} realPx 实际像素值
 * @returns {number} 设计稿像素值
 */
export function fromScalePx(realPx) {
  const { scale } = getScreenScale()
  return realPx / scale
}
