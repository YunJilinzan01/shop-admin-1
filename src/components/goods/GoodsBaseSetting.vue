<script setup>
// 引入请求方法
import { requestGoodsBaseSetting , merge } from '@/api/request'
import formatDate from '@/Tool/date'
import { reactive, ref, watchEffect } from 'vue'

// 切片大小 1MB
const CHUNK_SIZE = 1024 * 1024

// 表单数据
const form = reactive({
  goodsName: '',
  goodsPrice: '',
  goodsListImage: [],
  time: '',
  goodsSales:"",
  inventory:"",
  refundPrice:"",
  operate:0,
  admin:localStorage.getItem('admin') || ""
})

watchEffect(()=>{
  console.log(form.admin);

})

// 上传图片的 ref
const goodsListImage = ref(null)

// 监听图片选择
const change = (_, fileList) => {
  form.goodsListImage = fileList
}

// 主提交方法
const submit = async () => {
  // 取第一个图片文件
  const file = form.goodsListImage[0]
  const files = file ? file.raw : null
  if (!files) {
    alert('请上传图片')
    return
  }

  // 创建 worker 实例
  const worker = new Worker(new URL('@/workers/fileWorker.js', import.meta.url), { type: 'module' })

  // 用 Promise 包装 worker 回调，方便等待结果
  const workerPromise = new Promise((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data)
    }
  })

  // 发送文件和切片大小给 worker
  worker.postMessage({ file: files, chunkSize: CHUNK_SIZE })

  // 等待 worker 返回切片和 hash
  const { chunks, resultHash } = await workerPromise

  // 释放 worker
  worker.terminate()


  // 并发上传分片
  const uploadPromises = chunks.map((chunk) => {
    const fromChunk = new FormData()
    fromChunk.append('chunk', chunk.blob)
    fromChunk.append('index', chunk.index)
    fromChunk.append('start', chunk.start)
    fromChunk.append('end', chunk.end)
    fromChunk.append('chunkHash', chunk.hash) // 文件 hash
    fromChunk.append('fileHash', resultHash) // 文件 hash
    // 只在第一个分片上传商品信息
    if (chunk.index === 0) {
      fromChunk.append('goodsName', form.goodsName)
      fromChunk.append('goodsPrice', form.goodsPrice)
      fromChunk.append('goodsSales', form.goodsSales)
      fromChunk.append('inventory', form.inventory)
      fromChunk.append('refundPrice', form.refundPrice)
      fromChunk.append('time', formatDate(form.time))
      fromChunk.append('operate', form.operate)
      fromChunk.append('admin', form.admin)
    }
    // 发请求，返回 Promise
    return requestGoodsBaseSetting(fromChunk)
  })

  // 等待所有分片上传完成
  await Promise.all(uploadPromises)

  await merge({
    fileHash: resultHash,
    total: chunks.length,
    goodsName: form.goodsName,
    goodsPrice: form.goodsPrice,
    goodsSales: form.goodsSales,
    inventory: form.inventory,
    refundPrice: form.refundPrice,
    time: formatDate(form.time),
    operate: form.operate,
    admin: form.admin
  })
   alert('上传成功')
  // 清空表单内容（保持响应式）
  form.goodsName = ''
  form.goodsPrice = ''
  form.goodsListImage = []
  form.time = ''
  form.goodsSales = ''
  form.inventory = ''
  form.refundPrice = ''
  form.operate = 0
  form.admin = localStorage.getItem('userName') || ""


}
</script>
<template>
  <div id="GoodsBaseSetting">
    <el-form ref="formRef" :model="form" label-width="auto" @submit.prevent="submit">
      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">销量:</div>
        <div class="input-field">
          <el-input v-model="form.goodsSales" type="number" />
        </div>
      </el-container>


      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">库存:</div>
        <div class="input-field">
          <el-input v-model="form.inventory" type="number" />
        </div>
      </el-container>

      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">商品名称:</div>
        <div class="input-field">
          <el-input v-model="form.goodsName" />
        </div>
      </el-container>

      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">商品价格:</div>
        <div class="input-field">
          <el-input v-model="form.goodsPrice" type="number" />
        </div>
      </el-container>

       <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">退款金额:</div>
        <div class="input-field">
          <el-input v-model="form.refundPrice" type="number" />
        </div>
      </el-container>

      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">上架日期:</div>
        <div class="input-field">
          <el-date-picker v-model="form.time" type="datetime" placeholder="请选择日期" />
        </div>
      </el-container>

      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">列表图片:</div>
        <div class="input-field">
          <el-upload
            ref="goodsListImage"
            :auto-upload="false"
            :limit="1"
            :file-list="form.goodsListImage"
            list-type="picture-card"
            @change="change"
          >
            <el-icon size="20px" color="#00f">
              <Plus />
            </el-icon>
          </el-upload>
        </div>
      </el-container>



      <el-container class="content-row" style="display: flex; align-items: center">
        <el-button type="success" plain native-type="submit">提交</el-button>
      </el-container>
    </el-form>
  </div>
</template>
