import { ref } from 'vue'
import { defineStore } from 'pinia'
import { requestLogin } from '@/api/request'
export const useLoginStore = defineStore('Login', () => {
  const userName = ref('') // 用户名
  const passWord = ref('') // 密码
  const errorMessage = ref('') // 错误信息
  const isLogin = () => !!localStorage.getItem('token') // 检查是否登录

  // 清除用户信息
  const clearUserInfo = () => {
    userName.value = ''
    passWord.value = ''
    localStorage.removeItem('token') // 清除 token
    localStorage.removeItem('userName') // 清除用户名
  }

  // 登录用户信息
  const loginUserInfo = async (name, password) => {
    userName.value = name
    passWord.value = password
    try {
      const res = await requestLogin(name, password)

      if (res.data.code === 200 && res.data.token) {
        localStorage.setItem('token', res.data.token) // 存储 token
        localStorage.setItem('userName', userName.value) // 存储用户名

        return true // 登录成功
      }
      if (res.data.code === 401) {
        errorMessage.value = res.data.message // 设置错误信息

        return false // 登录失败
      }
    } catch (error) {
      error
      return false // 登录失败
    }
  }
  return {
    userName,
    passWord,
    errorMessage,
    clearUserInfo,
    loginUserInfo,
    isLogin,
  }
})
