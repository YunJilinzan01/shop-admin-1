import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/stores/Login.js'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login', // ✅ 新增这行
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginPage.vue'), // 使用组件的方式加载登录页面,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/HomePage.vue'), // 使用组件的方式加载主页
      redirect: '/home/order?type=0', // 默认重定向到订单页面
      children: [
        {
          path: 'order',
          name: 'order',
          component: () => import('@/components/goods/OrderPage.vue'), // 使用组件的方式加载订单页面
        },
        {
          path: 'goods/0',
          name: 'Goods',
          component: () => import('@/components/goods/GoodsPage.vue'),
        },

        {
          path: 'goods/1',
          name: 'AddGoods',
          component: () => import('@/components/goods/AddGoods.vue'),
        },
        {
          path: 'goods/2',
          name: 'Recommedn',
          component: () => import('@/components/goods/RecommendPage.vue'),
        },
        {
          path: 'goods/category',
          name: 'GoodsCategory',
          component: () => import('@/components/goods/GoodsCategory.vue'),
        },
        {
          path: 'ownerlist',
          name: 'ManagerList',
          component: () => import('@/components/manager/ManagerList.vue'),
        },
        {
          path: 'ownerreq',
          name: 'ManagerReqList',
          component: () => import('@/components/manager/ManagerReqList.vue'),
        },
        {
          path: 'ownerorder',
          name: 'ManagerOrder',
          component: () => import('@/components/manager/ManagerOrder.vue'),
        },
        {
          path: 'data',
          name: 'Data',
          component: () => import('@/components/financial/DataCom.vue'),
        },
        {
          path: 'tradeinfo',
          name: 'Tradeinfo',
          component: () => import('@/components/financialManagement/tradeinfoPage.vue'),
        },
        {
          path: 'tradelist',
          name: 'Tradelist',
          component: () => import('@/components/financialManagement/tradelistPage.vue'),
        },
      ],
    },
  ],
})
// 路由守卫：每次路由跳转前都会执行
router.beforeEach((to) => {
  const store = useLoginStore()

  const token = localStorage.getItem('token') || ''
  if (token) {
    // 如果有token，且访问的是登录页面，则重定向到主页
    if (to.name === 'login') {
      return { name: 'home' }
    }
    return true // 允许访问其他页面
  }
  if (!store.isLogin() && to.name !== 'login') {
    // 如果没有token，且访问的不是登录页面，则重定向到登录页面
    return { name: 'login' }
  }
  
})

export default router
