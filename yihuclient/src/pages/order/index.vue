<script setup>
defineOptions({
  name: 'OrderPage'
})
import api from '@/api';
import { computed, onMounted, reactive ,ref} from 'vue';
import counter from '@/components/counter.vue';
import { useRoute, useRouter } from 'vue-router';
import Qrcode from 'qrcode'
import { watch } from 'vue';
const router=useRouter()
const route=useRoute()
// 订单页面详情 传递订单id
const godetail=(item)=>{
  router.push(`/detail?oid=${item.out_trade_no}`)
}
onMounted(
  async()=>{
    await getorderlist()
    if(route.query.name){
      changename({ name: route.query.name })
      active.value=route.query.name
    }
  }
)

// 订单的参数
const  order=ref([])
const orderlist=ref([])
console.log();
const changename=(item)=>{
  if (item.name === '1') {
    orderlist.value=order.value
    return
  }
  orderlist.value=order.value.filter(p => {
    return statemap[p.trade_state] === item.name
  })
}
// 记录顶栏的位置
const active=ref(1)
const statemap={
  '全部':'1',
  '待支付':'2',
  '待服务':'3',
  '已完成':'4',
  '已取消':'5'
}
// 不同的状态对应不同的颜色
const colormap={
  '待支付':'#ffa200',
  '待服务':'#1da6fd',
  '已完成':'#21c521'
}
// 得到商业订单
const oderarr=[]
const getorderlist=async(state)=>{
  const res=await api.orderlist({state})
  res.data.data.forEach(
    item=>{
      // 当前剩余支付时间
      item.timer=item.order_start_time+7200000-Date.now()
    }
  )
 order.value=res.data.data
 orderlist.value=order.value
  }
</script>
<template>
  <div class="container">
    <div class="header">我的订单</div>
    <van-tabs @click-tab="changename" v-model:active="active">
      <van-tab title="全部" name="1" ></van-tab>
      <van-tab title="待支付" name="2" ></van-tab>
      <van-tab title="待服务" name="3"></van-tab>
      <van-tab title="已完成" name="4"></van-tab>
      <van-tab title="已取消" name="5"></van-tab>
    </van-tabs>
    <van-row @click="godetail(item)" v-for="item in orderlist" :key="item.out_trade_no" >
      <van-col span="5">
        <van-image :src="item.serviceImg" height="75px"></van-image>
      </van-col>
      <van-col span="14" class="text">
        <div class="text1">
          {{ item.service_name }}
        </div>
        <div class="text2">
          <div>
            {{ item.hospital_name }}
          </div>
          <div>
            预约时间：{{ item.starttime }}
          </div>
        </div>
      </van-col>
      <!-- 支付状态 -->
      <van-col :style="{color:colormap[item.trade_state]}" span="5">
        {{ item.trade_state }}
        <counter :second="item.timer" v-if="item.trade_state==='待支付'"></counter>
        
      </van-col>
    </van-row>
  </div>
</template>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
}

.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
}

.van-row {
  background-color: #fff;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;

  .text1 {
    font-size: 16px;
    line-height: 25px;
    font-weight: bold;
  }

  .text2 {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
  }
}

.bottom-text {
  line-height: 50px;
  text-align: center;
  color: #999999;
}
</style>