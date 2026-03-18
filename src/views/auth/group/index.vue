<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { getsetmenu, setmenu, getlist,getselectlist } from '@/api/index'
import PanelHead from '@/components/PanelHead.vue'
import { useRoute } from 'vue-router'
defineOptions({
  name: 'GroupPart'
})
onMounted(()=>{
  getlistdata()
  getselectlist().then(({data})=>{
    console.log(data.data,1);
    selectlist.value=data.data
  })
})
const selectlist=ref([])
// 通过id 匹配返回的数组
const findselectlist=(id)=>{
const data=selectlist.find(item=>item.id===id)
return data? data:''
}
// 获取权限列表
getsetmenu().then(
  ({ data }) => {
    form.permissions = data.data
  }
)
// 权限页面的页数和当前页面的数量
const listpage=reactive({
  pageNum: 3,
  pageSize: 1
})
// 权限表单的默认勾选
const checkbox = [4, 5]
//权限详情名单
const listitem = reactive({
  list: [],
  total: 0
})
// 设置权限的弹窗显示或隐藏开关
const dialogtype = ref(false)
const beforeclose = () => {
  dialogtype.value = false
  // 重置表单数据
  formref.value.resetFields()
  treeref.value.setCheckedKeys(checkbox)
}
const form = reactive({
  name: '',
  permissions: '',
  id: ''
})
const formref = ref()
const treeref = ref()
// 设置form的规则form的name字段不能为空
const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }]
})
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // 如果二次校验合规
    if (valid) {
      const permissions = JSON.stringify(treeref.value.getCheckedKeys())
      // 设置权限
      setmenu({ name: form.name, permissions, id: form.id }).then(({ data }) => {
        // 得到权限列表

      }
      )
      getlistdata()
    }
  }
  )
}

// 打开下面的数据弹窗
const open = (data = {}) => {
  dialogtype.value = true

  // 由于弹窗打开form是异步的因此 使用nexttick在还没打开弹窗时操控里面的数据
  nextTick(() => {
    if (data) {
      //改变弹窗表单的内容 将一个对象里面的值传给另一个对象 但是不改变对象
      Object.assign(form, { id: data.id, name: data.name })
      treeref.value.setCheckedKeys(data.permission)
    }
  })
}

// 得到 列表数据
const getlistdata = () => {
  getlist(listpage).then(
    ({ data }) => {
      const { list, total } = data.data
      listitem.list = list
      listitem.total = total
    })
    dialogtype.value=false
}
// 点击翻页后能显示当前页面的数据
const handleSizeChange=(val)=>{
  listpage.pageNum=val
  // getlistdata()
}
const handleCurrentChange=(val)=>{
  listpage.pageNum=val
  getlistdata()
}
const route=useRoute()
</script>
<template>
  <PanelHead :route="route"></PanelHead>
  <!-- 没有数据传入则直接打开 -->
  <el-button @click="open(null)" type="primary">+新建</el-button>
  <el-table :data="listitem.list">
    <el-table-column prop="id" label="id">
    </el-table-column>
    <el-table-column prop="name" label="name">
    </el-table-column>
    <el-table-column prop="permissionName" label="permissions">
    </el-table-column>
    <el-table-column >
      <!-- 自定义每一列的按钮 -->
      <template #default="scope">
        <!-- 拿到当前行的数据 并通过弹窗打开 -->
         <div class="editbutton">
        <el-button type="primary" @click="open(scope.row)">编辑
        </el-button></div>
      </template>
    </el-table-column>
  </el-table>
  <div class="demo-pagination-block">
    <div class="demonstration"></div>
    <el-pagination v-model:current-page="listpage.pageNum" v-model:page-size="listpage.pageSize"
      :background="false" layout="prev, pager, next, jumper" :total="listitem.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"  class="fanye"/>
  </div>
  <!-- 弹窗内容 -->
  <el-dialog v-model="dialogtype" :before-close="beforeclose">
    <!-- ref表示表单的实例对象 form表单的数据-->
    <el-form ref="formref" :model="form" :rules="rules">
      <!-- 后台返回的id与前台的同步 -->
      <el-form-item prop="id" v-show="false">
        <el-input v-model="form.id">

        </el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name" >
        <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions" class="quanxian">
        <!--ref 拿到tree的组件实例tree为弹窗里面的多选框  -->
        <el-tree ref="treeref" :data="form.permissions" show-checkbox node-key="id" :default-checked-keys="checkbox">
        </el-tree>
      </el-form-item>
      <el-button @click="submitForm(formref)">提交</el-button>
    </el-form>
  </el-dialog>
</template>
<style scoped lang="less">
:deep(.fanye){
  background-color: #fff;
  justify-content: flex-end;
}
.editbutton{
  margin-left: 100px;
}

</style>
