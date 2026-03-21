<script setup>
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { computed, onMounted, reactive, ref } from 'vue';
import StatusBar from '@/components/statusBar.vue';
import Counter from '@/components/counter.vue';
import Qrcode from 'qrcode'
defineOptions({
  name: 'DetailPage'
})
onMounted(async () => {
  const res = await api.orderdetail({ oid: route.query.oid })
  Object.assign(detaildata, res.data.data)
  console.log(detaildata);
  // 拿到支付图片路径
  payimg.value = Qrcode.toDataURL(res.data.data.code_url).then((url) => {
    payimg.value = url
  })
})
const route = useRoute()
const router = useRouter()
const goback = () => {
  router.back()
}
// 详情页数据
const detaildata = reactive({})
const stateMap = {
  '待支付': 10,
  '待服务': 20,
  '已完成': 30
}
// 不同的状态对应不同的颜色
const colormap = {
  '待支付': '#ffa200',
  '待服务': '#1da6fd',
  '已完成': '#21c521'
}
// 计算倒计时
const second = computed(() => {
  return detaildata.order_start_time ? detaildata.order_start_time + 7200000 - Date.now() : 0
})
// 支付功能
const payshow = ref(false)
const payimg = ref('')
const close = () => {
  payshow.value = false
}
// 订单详情
const makeInfo = {
  service_name: '预约服务',
  hospital_name: '就诊医院',
  starttime: '期望就诊时间',
  'client.name': '就诊人',
  'client.mobile': '就诊人电话',
  receiveAddress: '接送地址',
  demand: '其他需求'
}
// 订单需求
const orderInfo = {
  'client.mobile': '就诊人电话',

}
// 获取预约信息
const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      // 是时间戳的则要转换为时间
      return formatTimestamp(detaildata[key]);
    }
    return detaildata[key];
  }
  // 先将字符串 order.name等有 '.'的 化为数组 [order,name] reduce中 o是回调函数 p是初始值 相当于递归 把每次o的值给p 第一次是 o的初始值为detaildata p为前面split分出来的数组 第一次循环为 o[p]下次就是 o[p].p 相当于去递归层层拆解对象
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, detaildata);
  return arr;
}
// 转换时间戳为日期 年-月-日
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
</script>
<template>
  <div class="container">
    <van-icon @click="goback" name="arrow-left" class="header-left"></van-icon>
    请填写订单信息
    <StatusBar :item="stateMap[detaildata.trade_state]">
      <div class="tips">
        <!-- 订单状态显示 -->
        <div class="dzf" v-if="detaildata.trade_state === '待支付'">
          <div class="text1">
            订单待支付
          </div>
          <div class="text2">
            请在<Counter :second="second"></Counter>
            内支付否则超时
          </div>
          <div class="submitcontaner">
        <van-button type="success" @click="payshow=true" class="submit">立即支付</van-button>
      </div>         
      </div>
       <div class="dzf" v-if="detaildata.trade_state === '待服务'">
          <div class="text1">
            等待安排服务
          </div>
        </div>
        <div class="dzf" v-if="detaildata.trade_state === '已完成'">
          <div class="text1">
            订单已完成
          </div>
        </div>
        <div class="dzf" v-if="detaildata.trade_state === '已取消'">
          <div class="text1">
            订单已取消
          </div>
        </div>
        </div>
        <!-- 预约信息 -->
        <van-cell-group class="card">
          <div class="header-text">预约信息</div>
          <van-cell v-for="(item,key) in makeInfo" :key="key" :title="item" :value="formatData(key)"></van-cell>
        </van-cell-group>
    </StatusBar>
    <!-- 支付功能 -->
    <van-dialog v-model:show="payshow" title="支付" :show-confirm-button="false">
      <div class="kjk" @click="close">
        <van-icon name="cross" />
      </div>
      <div class="imgout"><img class="imgin" :src="payimg" /></div>
    </van-dialog>
  </div>
</template>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.submitcontaner{
  display: flex;
  justify-content: center;
  .submit{
  width: 200px;

}
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;

  .header-left {
    float: left;
  }
}

.kjk {
  position: absolute;
  top: 25px
}

.card {
  margin: 15px 0;
  padding: 10px;

  .header-text {
    padding-left: 5px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid red;
  }
}

.dzf {
  padding: 20px;

  .text1 {
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
    color: #666;
  }

  .text2 {
    font-size: 14px;
    color: #666;
  }

  .text3 {
    text-align: center;

    .van-button {
      margin-top: 10px;
      margin-left: 10px;
      width: 80%;
      font-weight: bold;
    }
  }
}

::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;

  .close {
    position: absolute;
    left: 20px;
  }
}
</style>