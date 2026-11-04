import request from '@/api/request'

// 获取用户总数
export function getUserCount() {
  return request({
    url: '/dashboard/user/count',
    method: 'get'
  })
}

// 获取检查总数
export function getExamCount() {
  return request({
    url: '/dashboard/exam/count',
    method: 'get'
  })
}

// 获取患者总数
export function getPatientCount() {
  return request({
    url: '/dashboard/patient/count',
    method: 'get'
  })
}

// 获取回访任务总数
export function getFollowupTaskCount() {
  return request({
    url: '/dashboard/followup/task/count',
    method: 'get'
  })
}

// 获取回访统计（按季度）
export function getFollowupStatsByQuarter() {
  return request({
    url: '/dashboard/followup/task/stats/quarter',
    method: 'get'
  })
}

// 获取回访统计（按月）
export function getFollowupStatsByMonth() {
  return request({
    url: '/exams/followup/task/stats/month',
    method: 'get'
  })
}

// 获取用户画像（按性别和年龄段）
export function getUserPortrait() {
  return request({
    url: '/dashboard/user/portrait',
    method: 'get'
  })
}

// 获取回访原因分析
export function getFollowupReasonAnalysis() {
  return request({
    url: '/dashboard/followup/reason/analysis',
    method: 'get'
  })
}
