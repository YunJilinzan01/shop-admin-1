<script setup>
// 引入模拟数据模块，用于生成假订单数据
import { requestGoodsList } from '@/api/request'
// 引入工具方法模块，包含导出等功能
// 引入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus'
// 引入 Vue 的响应式和生命周期相关方法
import { onMounted, ref } from 'vue'
// 引入 vue-router 的路由相关方法
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
// 组件挂载时，获取订单数据
onMounted(async () => {
  const res = await requestGoodsListData()
  console.log(res)
  if (res.data.code === 200 && res.data.data) {
    goodsData.value = res.data.data
    ElMessage({
      type: 'success',
      message: `获取成功${res.data.data.length}条`,
    })
    return
  }
  ElMessage({
    type: 'error',
    message: `获取失败`,
  })
})

const goodsData = ref([])

const queryParams = ref({
  goodsName: '',
  id: '',
  operate: '',
})

const requestData = async () => {
  const res = await requestGoodsListData(
    queryParams.value.goodsName,
    queryParams.value.id,
    queryParams.value.operate,
  )
  if (res.data.code === 200 && res.data.data) {
    ElMessage({
      type: 'success',
      message: '筛选请求参数',
    })
    goodsData.value = res.data.data
    console.log(goodsData.value)

    return
  }
  ElMessage({
    type: 'error',
    message: '筛选请求参数失败',
  })
}

const clear = async () => {
  const res = await requestGoodsListData()
  if (res.data.code === 200 && res.data.data) {
    ElMessage({
      type: 'success',
      message: '显示成功',
    })
    queryParams.value = {
      name: '',
      id: '',
      operate: '',
    }
    goodsData.value = res.data.data
    return
  }
  ElMessage({
    type: 'error',
    message: '清除失败',
  })
}
const addGoods = () => [
  router.push({
    name: 'AddGoods',
    query: {
      type: route.query.type,
    },
  }),
]

const requestGoodsListData = async (name, id, operate) => {
  return await requestGoodsList(name, id, operate)
}
const toggleOperate = async (row) => {
  // 假设有一个更新接口 updateGoodsOperate
  const newOperate = row.operate === 1 ? 0 : 1
  try {
    // 这里调用后端接口更新状态（你需要实现该接口）
    await requestGoodsList(row.goodsName, row.id, newOperate)
    row.operate = newOperate // 前端先行切换
    ElMessage.success(`已${newOperate === 1 ? '上架' : '下架'}`)
  } catch (e) {
    ElMessage.error('操作失败', e)
  }
}
</script>
<template>
  <div class="content-container" direction="vertical">
    <!-- input -->
    <div>
      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="input-tip">商品名称:</div>
        <div class="input-field">
          <el-input v-model="queryParams.goodsName" />
        </div>
        <div class="input-tip">商品编号:</div>
        <div class="input-field">
          <el-input v-model="queryParams.id" />
        </div>
        <div class="input-tip">是否上架</div>
        <div class="input-field">
          <el-select style="width: 240px" v-model="queryParams.operate">
            <el-option label="否" :value="0" key="0" />
            <el-option label="是" :value="1" key="1" />
            <el-option label="全部" :value="''" key="2" />
          </el-select>
        </div>
      </el-container>
    </div>
    <!-- button -->
    <div class="contet-row">
      <el-container>
        <el-button type="primary" @click="requestData">检索</el-button>
        <el-button type="primary" @click="clear">显示全部</el-button>
        <el-button type="success" @click="addGoods">新增商品</el-button>
      </el-container>
    </div>
    <!-- list -->
    <div>
      <el-table :data="goodsData" style="width: 100%" tooltip-effect="dark">
        <el-table-column label="商品" width="100">
          <template #default="scope">
            <div style="text-align: center">
              <el-image style="width: 60px; height: 100px" :src="scope.row.goodsImage" />
              <div style="text-align: center">{{ scope.row.goodsName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="180" prop="goodsPrice" />
        <el-table-column label="销量" prop="goodsSales" width="100" />
        <el-table-column label="库存" width="180" prop="inventory" />
        <el-table-column label="退款数量" width="180" prop="refundCount" />
        <el-table-column label="退款金额" prop="refundPrice" />
        <el-table-column label="操作" width="100" prop="operate">
          <template #default="scope">
            <el-button
              @click="toggleOperate(scope.row)"
              :type="scope.row.operate ? 'danger' : 'success'"
              >{{ scope.row.operate ? '下架' : '上架' }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="管理员" width="100" prop="admin" />
        <el-table-column label="更新时间" width="200" prop="time" />
      </el-table>
    </div>
  </div>
</template>
