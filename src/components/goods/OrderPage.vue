<script setup>
// 引入模拟数据模块，用于生成假订单数据
import { requestOrderList, delOrderItem } from '@/api/request'
import Mock from '@/mock/Mock'
// 引入工具方法模块，包含导出等功能
import Tools from '@/stores/Tools'
import formatDate from '@/Tool/date'
// 引入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus'
// 引入 Vue 的响应式和生命周期相关方法
import { onMounted, ref } from 'vue'
// 引入 vue-router 的路由相关方法
import { useRoute } from 'vue-router'

// 获取当前路由对象
const route = useRoute()

// 表格组件的引用，用于操作表格
const multipeTable = ref(null)
// 订单列表数据，存储所有订单
const orderList = ref([])
// 查询参数，绑定到页面上的筛选表单
const queryParams = ref({
  goods: '', // 商品名称
  userName: '', // 收货人
  payTime: [], // 支付时间
  name: '', // 用户名称
  phone: '', // 手机号
})
// 多选表格选中的订单
const multpleSelection = ref([])

// 筛选请求数据的方法
const requestData = async () => {
  const payTime = [
    formatDate(queryParams.value.payTime[0]),
    formatDate(queryParams.value.payTime[1]),
  ]
  queryParams.value.payTime = payTime

  const res = await orderDataList(
    queryParams.value.goods,
    queryParams.value.name,
    queryParams.value.phone,
    payTime,
  )

  if (res.data.code === 200) {
    ElMessage({
      type: 'success',
      message: `获取订单数据成功，共${res.data.data.length}条`,
    })
    // 更新订单列表数据
    orderList.value = res.data.data

    return
  }
  ElMessage({
    type: 'error',
    message: `获取订单数据失败`,
  })
}

const orderDataList = async (goods, userName, phone, oTime) => {
  return await requestOrderList(
    goods, // 传给 orderName
    userName, // 传给 userName
    phone,
    oTime,
  )
}

onMounted(async () => {
  const res = await orderDataList()
  if (res.data.code === 200) {
    ElMessage({
      type: 'success',
      message: `获取订单数据成功，共${res.data.data.length}条`,
    })
    orderList.value = res.data.data
    return
  }
  ElMessage({
    type: 'error',
    message: `获取订单数据失败`,
  })
})

const clear = async () => {
  queryParams.value = {
    goods: '',
    userName: '',
    payTime: [],
    name: '',
    phone: '',
  }
  const res = await orderDataList()
  if (res.data.code === 200) {
    ElMessage({
      type: 'success',
      message: `清除条件成功`,
    })
    orderList.value = res.data.data
    return
  }
}

const exportData = () => {
  Tools.exporJson(`订单.json${JSON.stringify(orderList.value)}`)
}

const dispatchGoods = () => {
  ElMessage({
    type: 'success',
    message: `发货商品${JSON.stringify(multpleSelection.value)}`,
  })
  orderList.value = Mock.getOrder(route.query.type)
}

const exportDispatchGoods = () => {
  Tools.exporJson(`发货单.json${JSON.stringify(multpleSelection.value)}`)
}

const handleClick = async (tab) => {
  ElMessage({
    type: 'success',
    message: `切换tab刷新数据${tab.props.label}`,
  })
  const res = await orderDataList()
  if (tab.props.label === '全部') {
    orderList.value = res.data.data
  } else if (tab.props.label === '未支付') {
    orderList.value = [...res.data.data].filter((item) => {
      return !item.oStatus
    })
  } else if (tab.props.label === '已支付') {
    orderList.value = [...res.data.data].filter((item) => {
      return item.oStatus
    })
  }
}

const handleSelectionChange = (val) => {
  multpleSelection.value = val
}

const deleteItem = async (index) => {
  await delOrderItem(index)
  const res = await orderDataList()
  if (res.data && res.data.code === 200) {
    orderList.value = res.data.data
    ElMessage.success('删除成功')
  } else {
    ElMessage.error('删除失败')
  }
}

const callUser = (item) => {
  ElMessage({
    type: 'success',
    message: `联系客户${item.phone}`,
  })
}
</script>

<template>
  <!-- 订单管理页面的主容器 -->
  <div id="order">
    <div class="content-container" direction="vertical">
      <!-- 筛选输入区域 -->
      <div>
        <!-- 第一行筛选条件：商品名称、收货人、支付时间 -->
        <el-container class="content-row" style="display: flex; align-items: center">
          <div class="input-tip">商品名称:</div>
          <div class="input-field">
            <!-- 商品名称输入框，双向绑定 queryParams.goods -->
            <el-input v-model.trim="queryParams.goods" />
          </div>
          <div class="input-tip">收货人:</div>
          <div class="input-field">
            <!-- 收货人输入框，双向绑定 queryParams.userName -->
            <el-input v-model.trim="queryParams.userName" />
          </div>
          <div class="input-tip">支付时间:</div>
          <div class="input-field">
            <!-- 支付时间选择器，双向绑定 queryParams.payTime -->
            <el-date-picker
              v-model.trim="queryParams.payTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </el-container>
        <!-- 第二行筛选条件：用户名称、手机号、发货时间 -->
        <el-container class="content-row" style="display: flex; align-items: center">
          <div class="input-tip">用户名称:</div>
          <div class="input-field">
            <!-- 用户名称输入框，双向绑定 queryParams.name -->
            <el-input v-model.trim="queryParams.name" />
          </div>
          <div class="input-tip">手机号:</div>
          <div class="input-field">
            <!-- 手机号输入框，双向绑定 queryParams.phone -->
            <el-input v-model.trim="queryParams.phone" />
          </div>
        </el-container>

        <!-- 操作按钮区域：筛选、清除筛选、导出、批量发货、下载发货样单 -->
        <el-container class="content-row" style="display: flex; align-items: center">
          <!-- 点击筛选按钮，调用 requestData 方法 -->
          <el-button type="primary" @click="requestData">筛选</el-button>
          <!-- 点击清除筛选按钮，调用 clear 方法 -->
          <el-button type="danger" @click="clear">清除筛选</el-button>
          <!-- 点击导出按钮，调用 exportData 方法 -->
          <el-button type="primary" @click="exportData">导出</el-button>
          <!-- 点击批量发货按钮，调用 dispatchGoods 方法 -->
          <el-button type="primary" @click="dispatchGoods">批量发货</el-button>
          <!-- 点击下载批量发货样单按钮，调用 exportDispatchGoods 方法 -->
          <el-button type="primary" @click="exportDispatchGoods">下载批量发货样单</el-button>
        </el-container>
      </div>

      <!-- 订单列表区域 -->
      <div class="list">
        <!-- tab 切换，不同订单状态 -->
        <el-tabs type="card" @tab-click="handleClick">
          <el-tab-pane label="全部"></el-tab-pane>
          <el-tab-pane label="未支付"></el-tab-pane>
          <el-tab-pane label="已支付"></el-tab-pane>
        </el-tabs>
        <!-- 订单表格，展示订单数据 -->
        <el-table
          :data="orderList"
          style="width: 100%"
          ref="multipeTable"
          tooltip-effect="dark"
          @select-change="handleSelectionChange"
        >
          <!-- data 表格数据源 -->

          <!-- 多选框列 -->
          <el-table-column type="selection" width="55" />
          <!-- 商品名称列 -->
          <el-table-column prop="orderName" label="商品" width="180" />
          <!-- 总价/数量列 -->
          <el-table-column prop="price" label="总价/数量" width="100" />
          <!-- 买家信息列 -->
          <el-table-column prop="userName" label="买家信息" width="100" />
          <!-- 交易时间列 -->
          <el-table-column prop="oTime" label="交易时间" width="200" />

          <!-- 分销信息列，显示经理或分销员 -->
          <el-table-column label="分销信息" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.startdevInfo ? null : 'info'" size="default">
                {{ scope.row.startdevInfo ? '经理' : '分销员' }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 状态列，显示已完成或未完成 -->
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.oStatus ? 'success' : 'danger'" size="default">
                {{ scope.row.oStatus ? '已完成' : '未完成' }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 操作列，包含删除和联系客户按钮 -->
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <!-- 删除按钮，点击调用 deleteItem 方法 -->
              <el-button type="danger" size="small" @click="deleteItem(scope.row.order_id)">
                删除
              </el-button>
              <!-- 联系客户按钮，点击调用 callUser 方法 -->
              <el-button type="primary" size="small" @click="callUser(scope.row)">
                联系客户
              </el-button>
            </template>
          </el-table-column>

          <!-- 支付方式列，显示微信或支付宝 -->
          <el-table-column label="支付方式" width="100">
            <template #default="scope">
              <el-tag size="default">
                {{ scope.row.paymentMethods ? '微信' : '支付宝' }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 来源列，显示订单来源 -->
          <el-table-column label="来源" width="300" prop="source" />
        </el-table>
        
      </div>
    </div>
  </div>
</template>
