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
export const requestGoodsList = async (goodsName = '', id = '', operate = '') => {
  return await request.request({
    url: '/goods',
    method: 'GET',
    params: {
      goodsName,
      id,
      operate,
    },
  })
}

// 获取商品设置
export const requestGoodsBaseSetting = async (formData) => {
  return await request.request({
    url: '/upload-chunk',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}


// 合并分片接口
export const merge = async (data) => {
  return await request.request({
    url: '/merge-chunks',
    method: 'POST',
    data, // 直接传对象，request库会自动转为json
    headers: {
      'Content-Type': 'application/json',
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
