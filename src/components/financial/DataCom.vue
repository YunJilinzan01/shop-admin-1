<script setup>
import { onMounted, ref } from 'vue'
import ChartsPages from './ChartsPages.vue'
import Mock from '@/mock/Mock'
const xData = ref(['8月1日', '8月2日', '8月3日', '8月4日', '8月5日', '8月6日'])
const chartsData = ref([])
const name = ref('销量')
const type = ref('总交易额')
const data = ref({})

const changeType = () => {
  chartsData.value = Mock.getChartsData()
}

onMounted(() => {
  chartsData.value = Mock.getChartsData()
  data.value = Mock.getTradeData()
  console.log(chartsData.value)
})
</script>
<template>
  <div id="dataCom">
    <div class="content-container">
      <el-container class="content-row" style="display: flex; align-items: center">
        <div class="info">总交易额:{{ data.allTra }}</div>
        <div class="info">秒杀交易额:{{ data.speTra }}</div>
        <div class="info">普通商品交易额:{{ data.norTra }}</div>
        <div class="info">累计用户数:{{ data.userCount }}</div>
        <div class="info">分销总用户数:{{ data.managerCount }}</div>
      </el-container>

      <el-container class="content-row" style="display: flex; align-items: center">
        <el-radio-group @change="changeType" v-model="type">
          <el-radio-button label="总交易额"></el-radio-button>
          <el-radio-button label="商品交易额"></el-radio-button>
          <el-radio-button label="新用户销量"></el-radio-button>
          <el-radio-button label="访客转化率"></el-radio-button>
          <el-radio-button label="下单转化率"></el-radio-button>
          <el-radio-button label="付款转化率"></el-radio-button>
          <el-radio-button label="流水"></el-radio-button>
        </el-radio-group>
      </el-container>

      <ChartsPages id="charts" :xData="xData" :data="chartsData" :name="name" />

      <div class="realTime">
        <div class="info">实时数据 - 更新时间: {{ data.time }}</div>
        <el-container class="content-row">
          <div class="block">
            <div class="title">付款金额:10000</div>
            <div class="subTitle">当日:1900</div>
            <div class="subTitle">昨日:1020</div>
          </div>
          <div class="block">
            <div class="title">支付订单数:1000</div>
            <div class="subTitle">当日:100</div>
            <div class="subTitle">昨日:130</div>
          </div>
          <div class="block">
            <div class="title">付款人数:503</div>
            <div class="subTitle">当日:102</div>
            <div class="subTitle">昨日:300</div>
          </div>
          <div class="block">
            <div class="title">付款转化率:70</div>
            <div class="subTitle">当日:50</div>
            <div class="subTitle">昨日:70</div>
          </div>
        </el-container>

        <el-container class="content-row">
          <div class="block">
            <div class="title">访客数:105310</div>
            <div class="subTitle">当日:10310</div>
            <div class="subTitle">昨日:20032</div>
          </div>
          <div class="block">
            <div class="title">访问次数:1022440</div>
            <div class="subTitle">当日:101230</div>
            <div class="subTitle">昨日:1022120</div>
          </div>
          <div class="block">
            <div class="title">新增用户:500</div>
            <div class="subTitle">当日:300</div>
            <div class="subTitle">昨日:200</div>
          </div>
          <div class="block">
            <div class="title">累计用户:1542200</div>
            <div class="subTitle">当日:154220</div>
            <div class="subTitle">昨日:154200</div>
          </div>
        </el-container>
      </div>
    </div>
  </div>
</template>

<style scoped>
#charts {
  width: 1200px;
  height: 400px;
}
.info {
  margin: 15px 40px;
  font-style: 20px;
  color: #777;
}
.realTime {
  width: 1200px;
  height: 300px;
  border: 1px solid #777;
}

.block {
  margin: auto;
  width: 300px;
  padding: 10px 30px;
}
.title {
  margin-top: 3px;
  font-style: 20px;
  color: #777;
}

.subTitle {
  margin-top: 3px;
  font-style: 18px;
  color: #777;
}
</style>
