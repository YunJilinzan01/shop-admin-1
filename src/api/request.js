import request from '@/Tool/request.js'

// 登录请求
export const requestLogin = async (username, password) => {
  return await request.request({
    url: '/login',
    method: 'POST',
    data: {
      username,
      password,
    },
  })
}

// 获取商品列表
export const requestOrderList = async (orderName = '', userName = '', phone = '', oTime = []) => {
  return await request.request({
    url: '/goodslist',
    method: 'GET',
    params: {
      orderName,
      userName,
      phone,
      oTime,
    },
  })
}

export const delOrderItem = async (index) => {
  console.log(index)
  return await request.request({
    url: '/deletelist',
    method: 'DELETE',
    params: {
      index,
    },
  })
}

// 获取商品详情
export const requestGoodsList = async () => {
  return await request.request({
    url: '/api/goods',
    method: 'GET',
  })
}

// 获取商品设置
export const requestGoodsBaseSetting = async (
  goodsName,
  goodsPirce,
  goodsImage,
  goodsListImage,
  goodsTime,
  goodsClassify,
) => {
  return await request.request({
    url: '/api/update',
    method: 'POST',
    data: {
      goodsName,
      goodsPirce,
      goodsImage,
      goodsListImage,
      goodsTime,
      goodsClassify,
    },
  })
}

// 获取商品分类
export const requestGoodsClassify = async () => {
  return await request.request({
    url: '/api/classify',
    method: 'GET',
  })
}

// 添加商品分类列表
export const addGoodsClassify = async (classifyName) => {
  return await request.request({
    url: '/api/addclassify',
    method: 'POST',
    data: {
      classifyName,
    },
  })
}
