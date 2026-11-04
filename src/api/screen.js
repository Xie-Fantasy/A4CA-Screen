import request from './request'

// 获取省份患者统计数据
export function getProvinceStats() {
  return request({
    url: '/exams/patient/screen/province-stats',
    method: 'get'
  })
}

// 获取城市患者统计数据
export function getCityStats() {
  return request({
    url: '/exams/patient/screen/province-stats',
    method: 'get'
  })
}

// 获取患者分布散点数据
export function getScatterData() {
  return request({
    url: '/exams/patient/screen/scatter-data',
    method: 'get'
  })
}
