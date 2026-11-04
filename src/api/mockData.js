const mockDashboard = {
  getUserCount: {
    code: 200,
    data: {
      total: 12856
    }
  },
  getExamCount: {
    code: 200,
    data: {
      total: 456789
    }
  },
  getPatientCount: {
    code: 200,
    data: {
      total: 89234
    }
  },
  getFollowupTaskCount: {
    code: 200,
    data: {
      total: 23456
    }
  },
  getUserPortrait: {
    code: 200,
    data: [
      { label: "0-12 岁", male: 8.5, female: 7.8 },
      { label: "12-18 岁", male: 6.2, female: 5.8 },
      { label: "18-44 岁", male: 19.5, female: 21.3 },
      { label: "45-59 岁", male: 16.8, female: 18.2 },
      { label: "60-74 岁", male: 13.2, female: 15.1 },
      { label: "75 岁以上", male: 5.8, female: 6.8 }
    ]
  },
  getFollowupStatsByQuarter: {
    code: 200,
    data: [
      { quarter: "2024/Q3", taskCount: 3200, completedCount: 2850 },
      { quarter: "2024/Q4", taskCount: 3800, completedCount: 3420 },
      { quarter: "2025/Q1", taskCount: 4100, completedCount: 3690 },
      { quarter: "2025/Q2", taskCount: 4500, completedCount: 4050 },
      { quarter: "2025/Q3", taskCount: 4800, completedCount: 4320 },
      { quarter: "2025/Q4", taskCount: 5200, completedCount: 4680 }
    ]
  },
  getFollowupStatsByMonth: (() => {
    const now = new Date()
    const data = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      data.push({
        month: d.toISOString(),
        phone: Math.floor(Math.random() * 500) + 200,
        wechat: Math.floor(Math.random() * 300) + 150,
        outpatient: Math.floor(Math.random() * 200) + 100,
        video: Math.floor(Math.random() * 100) + 50
      })
    }
    return {
      code: 200,
      data: data
    }
  })(),
  getFollowupReasonAnalysis: {
    code: 200,
    data: [
      { name: "检查结果异常", value: 18 },
      { name: "术后恢复观察", value: 18 },
      { name: "慢病随访管理", value: 17 },
      { name: "复诊提醒", value: 13 },
      { name: "用药情况跟踪", value: 10 },
      { name: "症状变化确认", value: 10 },
      { name: "其他", value: 14 }
    ]
  }
}

const mockScreen = {
  getProvinceStats: {
    code: 200,
    data: [
      { provinceCode: "330000", cityCode: "330100", value: 120583 },
      { provinceCode: "330000", cityCode: "330200", value: 299473 },
      { provinceCode: "330000", cityCode: "330300", value: 11543 },
      { provinceCode: "330000", cityCode: "330400", value: 181340 },
      { provinceCode: "330000", cityCode: "330500", value: 8521 },
      { provinceCode: "330000", cityCode: "330600", value: 12456 },
      { provinceCode: "330000", cityCode: "330700", value: 126162 },
      { provinceCode: "330000", cityCode: "330800", value: 9876 },
      { provinceCode: "330000", cityCode: "330900", value: 6543 },
      { provinceCode: "330000", cityCode: "331000", value: 11234 },
      { provinceCode: "110000", cityCode: "110100", value: 89567 },
      { provinceCode: "310000", cityCode: "310100", value: 156789 },
      { provinceCode: "320000", cityCode: "320100", value: 134567 },
      { provinceCode: "440000", cityCode: "440100", value: 178234 },
      { provinceCode: "510000", cityCode: "510100", value: 145678 }
    ]
  },
  getCityStats: {
    code: 200,
    data: [
      { cityCode: "330200", value: 299473 },
      { cityCode: "330400", value: 181340 },
      { cityCode: "330700", value: 126162 },
      { cityCode: "330100", value: 120583 },
      { cityCode: "330300", value: 11543 },
      { cityCode: "110100", value: 89567 },
      { cityCode: "310100", value: 156789 },
      { cityCode: "320100", value: 134567 },
      { cityCode: "440100", value: 178234 },
      { cityCode: "510100", value: 145678 }
    ]
  },
  getScatterData: {
    code: 200,
    data: [
      { patientId: "P001", lng: 120.153576, lat: 30.287459 },
      { patientId: "P002", lng: 121.473701, lat: 31.230416 },
      { patientId: "P003", lng: 118.767413, lat: 32.041544 },
      { patientId: "P004", lng: 120.155070, lat: 30.274084 },
      { patientId: "P005", lng: 119.296511, lat: 26.074505 },
      { patientId: "P006", lng: 120.492593, lat: 30.209994 },
      { patientId: "P007", lng: 120.585317, lat: 29.987135 },
      { patientId: "P008", lng: 121.448554, lat: 28.902963 },
      { patientId: "P009", lng: 120.225501, lat: 30.199268 },
      { patientId: "P010", lng: 119.714659, lat: 30.001183 },
      { patientId: "P011", lng: 120.096246, lat: 29.280111 },
      { patientId: "P012", lng: 118.885894, lat: 28.825618 },
      { patientId: "P013", lng: 117.033646, lat: 28.235123 },
      { patientId: "P014", lng: 115.900937, lat: 28.683456 },
      { patientId: "P015", lng: 114.932876, lat: 27.834567 },
      { patientId: "P016", lng: 113.134026, lat: 23.045678 },
      { patientId: "P017", lng: 112.938814, lat: 22.543210 },
      { patientId: "P018", lng: 108.948024, lat: 34.263211 },
      { patientId: "P019", lng: 104.065735, lat: 30.659862 },
      { patientId: "P020", lng: 106.504962, lat: 29.533152 }
    ]
  }
}

export const mockData = {
  ...mockDashboard,
  ...mockScreen
}

export default mockData