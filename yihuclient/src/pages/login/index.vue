<script setup>
import { reactive,getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
const {proxy}=getCurrentInstance()
defineOptions({
  name: 'LoginPage'
})
const form=reactive({
  userName:'18171963289',
  passWord:'1234'
})
const router=useRouter()
const submit =async()=>{
  const res=await proxy.$api.login(form)
  console.log(res.data);
  const data=res.data
  localStorage.setItem('token',data.data.token)
  localStorage.setItem('userInfo',JSON.stringify(data.data.userInfo))
  router.push('/')
}
</script>
<template>
  <div class="login">
    <h1>
      登录
    </h1>
  
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field v-model="form.userName" name="用户名" label="用户名" placeholder="请输入用户名用户名"
        :rules="[{ required: true, message: '请填写用户名' }]" />
    </van-cell-group>
    <van-cell-group inset>
      <van-field type="password" v-model="form.passWord" name="密码" label="密码" placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写用户名' }]" />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit" @click="submit">
        提交
      </van-button>
    </div>
  </van-form>
  </div>
</template>
<style lang="less" scoped>
.login{
  text-align: center;
}
</style>