// 简单的请求封装
// 开发环境使用代理，生产环境使用完整 URL
const BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')

export function request(config) {
  return new Promise((resolve, reject) => {
    const url = config.url.startsWith('http') ? config.url : `${BASE_URL}${config.url}`
    
    console.log('请求 URL:', url)
    
    fetch(url, {
      method: config.method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(res => {
      console.log('响应状态:', res.status)
      return res.json()
    })
    .then(data => {
      console.log('响应数据:', data)
      if (data.code === 200) {
        resolve(data)
      } else {
        reject(data)
      }
    })
    .catch(err => {
      console.error('请求失败:', err)
      reject(err)
    })
  })
}

export default request
