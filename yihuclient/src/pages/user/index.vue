<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
defineOptions({
  name: 'UserPage'
})
const userInfo = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  return userInfo ? userInfo : {}
})
const router=useRouter()
// 实现点击订单能跳转页面
const gorder=(item)=>{
  router.push(`/order?name=${item}`)
}
const quit=()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}
</script>
<template>
  <div class="container">
    <div class="user">
      <van-image :src="userInfo.avatar" width="100px" class="img" >
      </van-image>
      <div class="text">{{ userInfo.name }}</div>
    </div>
    <div class="order">
      <div class="top">
        <div class="text1">我的订单</div>
        <div class="text2">我的全部</div>
      </div>
        <div class="buttom">
          <div class="item" @click="gorder(2)">
            <van-image  width="40" height="40px" src="/images/od_10.png"></van-image>
            <div>待支付</div>
          </div>
          <div class="item" @click="gorder(3)">
            <van-image  width="40" height="40" src="/images/od_20.png"></van-image>
            <div>待服务</div>
          </div>
          <div class="item" @click="gorder(4)">
            <van-image  width="40" height="40" src="/images/od_30.png"></van-image>
            <div>已完成</div>
          </div>
          <div class="item" @click="gorder(5)">
            <van-image  width="40" height="40" src="/images/od_40.png"></van-image>
            <div>已取消</div>
          </div>
        </div>
    </div>
    <div class="foot">
      <div class="foot1">
        <div class="text1">
          <van-image width="20" height="20" src="/images/ic_clients.png">
          </van-image>
          服务对象管理
        </div>
        <div class="text2">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="foot1">
        <div class="text1">
          <van-image width="20" height="20" src="/images/ic_share.png">
          </van-image>
          分享转发
        </div>
        <div class="text2">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <van-button type="danger" @click="quit" class="quit">退出登录</van-button>
  </div>
</template>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
  overflow: hidden;

  .user {
    width: 95%;
    height: 200px;
    background-color: #fff;
    text-align: center;
    border-radius: 10px;
    margin: 10px;

    .img {
      margin-top: 30px;
    }

    .text {
      line-height: 30px;
      font-weight: bold;
    }
  }

  .order {
    width: 90%;
    margin: 10px;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;

    .top {
      margin: 10px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;

      .text1 {
        color: #333;
      }

      .text2 {
        color: #999;
      }

      border-bottom: 0.5px solid #f5f5f5;
    }

    .buttom {
      padding: 10px;
      display: flex;
      justify-content: space-around;

      .item {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .foot {
    margin: 0 10px;
    padding: 10px;
    line-height: 50px;
    background-color: #fff;

    .foot1,
    .foot2 {
      display: flex;
      justify-content: space-between;
      color: #555;
    }

    .foot1 {
      border-bottom: 0.5px solid #f5f5f5;
    }
  }

  .quit {
    width: 90%;
    margin: 20px;
  }

  .quit_text {
    margin: 20px 0;
    text-align: center;
  }
}
</style>