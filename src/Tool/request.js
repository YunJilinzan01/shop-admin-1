import axios from 'axios'
const baseURL = import.meta.env.VITE_API_BASE_URL || ''
const request = axios.create({
  baseURL,
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

export default request
