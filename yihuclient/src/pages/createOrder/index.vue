<script setup>
import StatusBar from '@/components/statusBar.vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { computed, onMounted, reactive, ref } from 'vue';
import { showNotify } from 'vant';
import Qrcode from 'qrcode'
defineOptions({
  name: 'CreateOrder'
})
const router = useRouter()
const goback = () => {
  router.back()
}
// 医护师名单
const companion = reactive({
  companion: [],
  hospitals: [],
  service: {},
})
// 提交订单的信息
const form=reactive(
  {
    hospital_id:'',
    hospital_name:'',
    demand:'',
    companion_id:'',
    receiveAddress:'',
    tel:'',
    starttime:''
  }
)
// 获取陪护师列表信息
onMounted(async () => {
  const res = await api.getcompanion()
  console.log(res.data);
  Object.assign(companion, res.data.data)
})
// 就诊医院弹窗是否显示
const showhhospital = ref(false)
const hospitallist = computed(() => {
  return companion.hospitals.map(item => {
    return { text: item.name, value: item.id }
  })
})
// 提交医院信息
const confirmhospital=(item)=>{
form.hospital_name=item.selectedOptions[0].text
form.hospital_id=item.selectedOptions[0].value
showhhospital.value=false
console.log(form);
}
// 选择 提交时间
const showdata=ref(false)
const date=ref('')
const confirmdata=(item)=>{
  console.log(item);
  // 拼接日期
  const datastr=item.selectedValues.join('-')
  date.value=datastr
  form.starttime=new Date(datastr).getTime()
  console.log(form);
  showdata.value=false
}
const minDate=computed(()=>{
  return new Date()
})
// 设置最大天数是14天后
const maxDate=computed(()=>{
  const date=new Date()
  date.setDate(date.getDate()+14)
  return date
})
// 陪诊师弹窗
const showpermison=ref(false)
const permisonlist=computed(()=>{
  return companion.companion.map(
    item => {
      return { text: item.name, value: item.id }
    }
  )
})
const perimisonname=ref('')
const confirmpeimisson=(item)=>{
  console.log(item);
  console.log(perimisonname.value);
  form.companion_id=item.selectedOptions[0].value
  perimisonname.value=item.selectedOptions[0].text
  showpermison.value=false
}
// 接送地址弹窗
const place = ref(false)
const placelist = computed(() => {
  return companion.companion.map(
    item => {
      return { text: item.name, value: item.id }
    }
  )
})
const showplace = ref('')
const confirmplace = (item) => {
  console.log(item);
  console.log(perimisonname.value);
  form.companion_id = item.selectedOptions[0].value
  perimisonname.value = item.selectedOptions[0].text
  showdata.value = false
}
// 提交信息
const submitform=async ()=>{
 for (const i in form){
  if(!form[i]){
    showNotify({ 
      type:'danger',
      message:'请填写每一项'})
    return
  }
 }
 const res= await api.postcreateorder(form) 
 console.log(res);
//  通过qrcode插件让后端返回的wechat支付路径变成 图片
 payimg.value=Qrcode.toDataURL(res.data.data.wx_code).then((url)=>{
  payimg.value=url
  payshow.value=true
 })
}
// 支付功能
const payshow=ref(false)
const payimg=ref('')
const close=()=>{
  payshow.value=false
  router.push('/order')
}

</script>
<template>
  <div class="header">
    <van-icon @click="goback" name="arrow-left" class="header-left"></van-icon>
    请填写订单信息
  </div>
  <StatusBar item="0">
    <van-cell class="cell">
      <template #title>
        <van-image width="25" height="25" :src="companion.service.serviceImg"></van-image>
        <span class="server-name">{{ companion.service.serviceName }}</span>
      </template>
      <div @click=" " class="service-text">服务内容 </div>
    </van-cell>
    <!-- 表格部分 -->
    <van-cell-group>
          <van-cell title="选择就诊医院" value="" @click="showhhospital=true">
            <div @click=" " class="">{{ form.hospital_name ? form.hospital_name : '请选择就诊医院' }}
              <van-icon @click="" name="arrow" class=""></van-icon>
            </div>
          </van-cell>
          <van-cell title="选择时间" value="" @click="showdata = true" >
            <div @click=" ">{{ form.starttime? date: '请选择时间' }}
              <van-icon @click="" name="arrow" class=""></van-icon>
            </div>
          </van-cell>
          <van-cell title="选择陪诊师" value="" @click="showpermison = true">
            <div @click=" ">{{ perimisonname ? perimisonname : '请选择陪护师' }}
              <van-icon @click="" name="arrow" class=""></van-icon>
            </div>
          </van-cell>
          <van-cell title="接送地址" value="" @click="showplace = true">
            <van-field class="text" input-align="right" v-model="form.receiveAddress" placeholder="请填写接送地址"></van-field>
          </van-cell>
          <van-cell title="联系电话" value="" @click="showphone = true">
           <van-field class="text" input-align="right" v-model="form.tel" placeholder="请填写联系电话"></van-field>
          </van-cell>
          <van-cell>
            <van-field class="text" v-model="form.demand" placeholder="请描述要预约的诊室"></van-field>
          </van-cell>
    </van-cell-group>
    <van-button class="submit" @click="submitform" type="success">提交</van-button>
        <!-- 弹窗部分 -->
        <van-popup position="bottom"  round v-model:show="showhhospital" :style="{padding:'10px'}">
          <van-picker :columns="hospitallist" @cancel="showhhospital = false" @confirm="confirmhospital" />
        </van-popup>
        <!-- 选择时间 -->
        <van-popup v-model:show="showdata" position="bottom">
        <van-date-picker title="选择日期"  :min-date="minDate" :max-date="maxDate" @cancel="showdata=false" @confirm="confirmdata"/>
        </van-popup>
         <van-popup v-model:show="showpermison" position="bottom">
            <van-picker title="选择日期" :columns="permisonlist" @cancel="showpermison = false"
              @confirm="confirmpeimisson" />
            </van-popup>
            <!-- 支付功能 -->
             <van-dialog v-model:show="payshow" title="支付" :show-confirm-button="false">
              <div class="kjk">
                <van-icon name="cross" @click="close"/>
              </div>
      <div class="imgout"><img class="imgin" :src="payimg" /></div>
    </van-dialog>
  </StatusBar>
</template>
<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}
.submit{
  position: absolute;
  right: 0;
  bottom: 12px;
  right: 12px;
}
.kjk{
  position:absolute;
  top:30px;
  left:10px;
}
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;

  .header-left {
    float: left;
    line-height: 30px;
  }
}
.imgout{
  height: 200px;
  display: flex;
  justify-content: center;  
}
.cell {
  width: 95%;
  margin: 5px auto;
  background-color: #fff;

  ::v-deep(.van-field__control) {
    color: var(--van-cell-value-color);
  }

  ::v-deep(.van-cell__title) {
    display: flex;
    align-items: center;
  }

  .server-name {
    margin-left: 10px;
  }
}

.service-text {
  background: url(data:image/png;base64,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) no-repeat center center;
  background-size: 20px;
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