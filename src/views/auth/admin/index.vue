<script setup>
defineOptions({
  name:'AdminPart'
})
import { manageuser,getlist,getselectlist,updatauser} from '@/api/index'
import { nextTick, onMounted, reactive } from 'vue';
import {ref} from 'vue'
import dayjs, { Dayjs } from 'dayjs';
import { useRoute } from 'vue-router';
import PanelHead from '@/components/PanelHead.vue';
onMounted(()=>{
  getlistdata()
  permissiondata()
})
const route=useRoute()
const form=reactive({
  name:'',
  permissions_id:0
})
const listitem = reactive({
  list: [],
  total: 0
})
const admin=reactive(
  {
    pageNum:1,
    pageSize:5
  }
)
const rules=reactive({
  name:[{required:true,trigger:'blur',message:'请填写名称'}],
  permissions_id: [{ required: true, trigger: 'blur', message: '请选择权限' }]
})
const formref=ref()
const beforeclose = () => {
  dialogtype.value = false
  // 重置表单数据
}
const  dialogtype=ref(false)
// 权限管理菜单 有啥权限
const permission=ref([])
// 得到用户的权限管理
const getlistdata = () => {
  manageuser(admin).then(
    ({ data }) => {
      console.log(data);

      listitem.list= data.data.list
      listitem.total=data.data.total
      // 将时间戳转换为时间
      console.log(listitem);

      listitem.list.forEach((item)=>{
        item.create_time=dayjs(item.create_time).format('YYYY-MM-DD')
      })
    }
  )
}
// 获取用户权限管理列表
const permissiondata=()=>{

  getselectlist().then(
    ({data})=>{
      permission.value=data.data
      console.log(permission.value);

      })
    }
// 得到 当前用户所拥有的权限
const getpermisson=(id)=>{
  const data=permission.value.find(item=>item.id===id)
  return data? data.name:'超级管理员'
}
// 打开下面的数据弹窗
const open = (data = {}) => {
  dialogtype.value = true
  // 由于弹窗打开form是异步的因此 使用nexttick在还没打开弹窗时操控里面的数据
  nextTick(() => {
    if (data) {
      //改变弹窗表单的内容 将一个对象里面的值传给另一个对象 但是不改变对象
      console.log(data);

      Object.assign(form, {mobile: data.mobile,
        name: data.name,
        permissions_id: data.permissions_id})
    }
  })
}
// 修改权限
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // 如果二次校验合规
    if (valid) {
     updatauser(form).then(
      ({data})=>{
        console.log(form,form);
        console.log(data);

      }
     )
     getlistdata()
    dialogtype.value=false
    }

  }

  )
}
</script>
<template>
  <!-- 将当前组件路由传递过去 由于路由中包含当前页面的mate信息因此能实现自定义当前页面的头部简介显示-->
    <panel-head :route="route"></panel-head>
  <el-table :data="listitem.list" :rules="rules">
    <el-table-column prop="id" label="id">
    </el-table-column>
    <el-table-column prop="name" label="name">
    </el-table-column>
    <el-table-column prop="mobile" label="mobile">
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
    </el-table-column>
    <el-table-column prop="permissions_id" label="permissions">
      <template #default="scope">
        {{ getpermisson(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="active" label="状态">
      <!-- 通过 插槽 scope.row能得到当前列值 -->
     <template #default="scope"> <el-tag :type="scope.row.active? 'success':'danger'">
          {{ scope.row.active? 'success':'danger'}}
      </el-tag> </template>
    </el-table-column>
    <el-table-column>
      <!-- 自定义每一列的按钮 -->
      <template #default="scope">
        <!-- 拿到当前行的数据 并通过弹窗打开 -->
        <div class="editbutton">
          <el-button type="primary" @click="open(scope.row)">编辑
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogtype" :before-close="beforeclose">
    <!-- ref表示表单的实例对象 form表单的数据-->
    <el-form ref="formref" :model="form"  >
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入名字"></el-input>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字"></el-input>
      </el-form-item>
      <el-form-item label="permissions" prop="permissions_id">
        <el-select v-model="form.permissions_id" placeholder="请选择菜单权限">
          <el-option v-for="item in permission" :key="item.id" :value="item.id" :label="item.name">

          </el-option>
        </el-select>
      </el-form-item>
      <el-button @click="submitForm(formref)">提交</el-button>
    </el-form>
  </el-dialog>
</template>
<style scoped>
</style>
