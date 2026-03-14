<script setup>
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue'
import {getcode, signuser,login } from '@/api/index'
import { useRouter } from 'vue-router';
 defineOptions({ name: 'LoginView' })
 //让图片打包 生产环境任能显示
 const imgurl=new URL('../../../public/login-head.png', import.meta.url).href
 const router=useRouter()
 const type=ref(1)
 //表示 登录和注册的切换
 const typechange=()=>{
  type.value=!type.value
 }
 //表单的数据
 const form=reactive({
     userName: '18171963289',
     passWord:'' ,
     validCode:''
 })
 //验证码的数据
 const countdown=reactive({
  vaildText:'获取验证码',
  count:60
 })
 //防抖 防止反复点击验证码
 let flag=0
 //手机倒计时计时器
 const countdownchange=()=>{

  // 判断手机号
  const regexp= /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if(!form.userName||!regexp.test(form.userName)){
    return ElMessage.error('手机号错误')
  }
 if(flag)return
  flag=1
  getcode({tel:form.userName}).then(({data})=>{
    console.log(data);

  })
  countdown.vaildText=countdown.count+'秒'
  const timer=setInterval(() => {
    if(countdown.count<=0){
      countdown.count=60
      flag=0
      countdown.vaildText='获取验证码'
      clearInterval(timer)
      return
    }
    countdown.count--
    countdown.vaildText = countdown.count + '秒'
  },1000)
 }
 // 手机号校验
const validateUser = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  const regexp = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if (!regexp.test(value)) {
    callback(new Error('手机号格式错误'))
  } else {
    callback()
  }
}

// 密码校验
const validatePass = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  const reg = /^[a-zA-Z0-9_]{4,16}$/
  if (!reg.test(value)) {
    callback(new Error('密码4-16位，支持字母/数字/下划线'))
  } else {
    callback()
  }
}
 //表单校验器
 const rules=reactive({
   userName: [
     { validator: validateUser, trigger: 'blur' }
   ],
   passWord: [
     { validator: validatePass, trigger: 'blur' }
   ]
 })
// 对表单进行二次校验 element plus 表单封装的方法
const loginref=ref()
 const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // 如果二次校验合规
    if (valid) {
      // 如果是注册页面
      if(!type.value){
      signuser(form).then(({data})=>{{
        console.log(data.message==='success');
        if(data.message==='success'){
          type.value=1
          console.log(1);
        }
      }})
    }
      // 如果是登录页面
      else{
        login({
          userName:form.userName,
          passWord:form.passWord
        }).then((data)=>{
          if(data.data.message!=='success')return
          console.log(data);
          localStorage.setItem('token',data.data.data.token)
          localStorage.setItem('userInfo',JSON.stringify(data.data.data.userInfo))
          // 登录成功后跳转到主页面
          console.log(1);

          router.push('/')
        })
      }
      console.log('submit!','valiid',valid,'fields',fields)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <el-row class="login" justify="center" align="middle">
    <el-card style="max-width: 480px;">
      <!-- 让img在card header中 -->
      <template #header>
        <div class="card-header">
      <img :src="imgurl" alt="">
        </div>
    </template>
    <div class="jump-link" @click="typechange()">
      <el-link >
        {{ type? '登录':'注册' }}
      </el-link>
    </div>
    <!-- prop表示字段名 在 el-form中加入rules可以进行检验-->
      <el-form ref="loginref"  :model="form" label-width="auto" style="max-width: 600px" :rules="rules">
        <el-form-item  prop="userName">
          <el-input placeholder="用户名" v-model="form.userName" :prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item  prop="passWord">
          <el-input placeholder="密码" :prefix-icon="Lock" v-model="form.passWord" >
          </el-input>
        </el-form-item>
        <el-form-item prop="count" v-if="!type">
          <el-input placeholder="验证码" :prefix-icon="Lock" v-model="form.validCode">
            <template #append >
                <div class="validTest" @click="countdownchange()">{{ countdown.vaildText }}</div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- 将表单的 loginref 当做参数传过去  -->
          <el-button type="primary" :style="{width: '100%'}" @click="submitForm(loginref)">{{ type?'登录':'注册' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
<style scoped lang="less">
:deep(.el-card__header) {
  padding: 0
}

.login {
  height: 100%;
  .card-header {
    background-color: #899fe1;

    img {
      width: 430px;
    }
  }

  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
