<script setup>
import PanelHead from '@/components/PanelHead.vue'
import { useCounterStore } from '@/stores/counter'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { getphotolist,companion,getcompanionlist, deletecompanion } from '@/api'
import { ElMessage } from 'element-plus'
import { InfoFilled,Delete} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
defineOptions({
  name: 'VppzStaff'
})
onMounted(() => {
  getphotolist().then(
    ({ data }) => {
      piclist.value=data.data
    }
  )
  getlist()
})
const listpage=reactive({
  pageNum:1,
  pageSize:2
})
const companionlist=reactive({})
const getlist=()=>{
  getcompanionlist(listpage).then(
    ({data})=>{
      companionlist.list=data.data.list
      companionlist.total=data.data.total
    }
  )
}
// 记录选择的是第几张图片
const selectindx=ref(0)
const piclist=ref([])
const dialogtype = ref(false)
const dialogimage = ref(false)
const beforeclose = () => {
  dialogtype.value=false
}
const beforeimg=()=>{
  dialogimage.value=false
}
// 表单校验
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // 如果二次校验合规
    if (valid) {
      companion(form).then(
        ({data})=>{
          if(data.code===10000){
        ElMessage.success('成功')
          console.log(data.data);
          getlist()
          dialogtype.value=false
        }
        else{
        ElMessage.error(data.message)
      }
      })
    }
    else {

    }
  }
  )
}
const form = reactive({
  id: 0,
  mobile: '',
  active: 1,
  age: 0,
  avatar: '',
  sex: '1'
})
const rules = reactive({
  name:[{required:true,trigger:'blur',message:'请填写姓名'}],
  sex: [{ required: true, trigger: 'change', message: '请填写性别' }],
  mobile: [{ required: true, trigger: 'blur', message: '请填写手机号' }],
  avatar: [{ required: true, trigger: 'change', message: '请选择头像' }],
})
const formref = ref()
const submitimg=()=>{
  form.avatar=piclist.value[selectindx.value].url
  dialogimage.value=false
}

const fixAvatarUrl = (url) => {
  if (!url) return ''
  const protocol = window.location.protocol
  if (url.startsWith('//')) {
    return url
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.replace(/^https?:\/\//, `${protocol}//`)
  }
  if (url.startsWith('/')) {
    return `${protocol}//159.75.169.224:5500${url}`
  }
  return `${protocol}//159.75.169.224:5500/${url}`
}

// 翻页函数
const handleSizeChange = (val) => {
  listpage.pageSize = val
  getlist()
}
const handleCurrentChange = (val) => {
  listpage.pageNum = val
getlist()
}
// 勾选的数据
const selectdata=ref([])
// 拿到勾选的数据
const handleSelectionChange=(val)=>{
selectdata.value=val
}

// 编辑表单
const open=(rowdata={})=>{
  dialogtype.value=true
  // 弹窗打开编辑是异步任务
  nextTick(()=>{
    if(rowdata){
      // 让弹窗 form表单的数据变成当前的数据rowdata
      Object.assign(form,rowdata)
    }
  })
}
// 如果点击删除yes
const confirm=()=>{
  // 如果没有在多选框选择
  if(!selectdata.value.length){
    return ElMessage.warning('请至少选择一项数据')
  }
  // 删除选择的数据
  deletecompanion({id:selectdata.value}).then(({data})=>{
    console.log(data);
    // 如果删除成功
    if(data.code===10000){
      getlist()
    }
  })
}
const route=useRoute()
</script>
<template>
  <PanelHead :route="route"></PanelHead>
  <div class="header">
  <el-button type="primary" @click="dialogtype = true" back>新增+</el-button>
    <el-popconfirm width="220" :icon="Delete" icon-color="#626AEF" title="你确定要删除这些吗?"
    confirm-button-text="是"
    cancel-button-text="否"
      @confirm="confirm">
      <template #reference>
        <el-button type="danger">删除-</el-button>
      </template>
    </el-popconfirm>
<!-- handleselectionchange 拿到勾选的数据 -->
  <el-table :data="companionlist.list" :rules="rules" @selection-change="handleSelectionChange">


    <el-table-column prop="id" label="id" type="selection">
    </el-table-column>
    <el-table-column prop="mobile" label="手机">
    </el-table-column>
      <el-table-column prop="active" label="状态">
        <!-- 通过 插槽 scope.row能得到当前列值 -->
        <template #default="scope"> <el-tag :type="scope.row.active ? 'success' : 'danger'">
            {{ scope.row.active ? 'success' : 'danger' }}
          </el-tag> </template>

    </el-table-column>
    <el-table-column prop="age" label="年龄">
    </el-table-column>
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image :src="fixAvatarUrl(scope.row.avatar)">
        </el-image>
      </template>
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
  <!-- 分页逻辑 -->
    <div class="demo-pagination-block">
      <div class="demonstration"></div>
      <el-pagination v-model:current-page="listpage.pageNum" v-model:page-size="listpage.pageSize" :background="false"
        layout="prev,pager, next, jumper" :total="companionlist.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" class="fanye" />
    </div>

  <!-- 弹窗部分 -->
  <el-dialog v-model="dialogtype" :before-close="beforeclose">
    <el-form ref="formref" :model="form" :rules="rules">
      <el-form-item prop="id" v-show="false">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="form.name" ></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="active" label="是否启用">
        <el-radio-group v-model="form.active">
          <el-radio :value='1' label="生效"></el-radio>
          <el-radio :value='0' label="不生效"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="sex" label="性别">
        <el-select v-model="form.sex" placeholder='请选择性别'>
          <el-option value='1' label="男"></el-option>
          <el-option value='2' label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input-number v-model="form.age" :min="18" :max="50"></el-input-number>
      </el-form-item>
      <!-- 如果没有avatar头像 就点击去上传头像   -->
      <el-form-item prop="avatar" label="头像">
        <el-button v-if="!form.avatar" type="primary" @click="dialogimage=true">
          点击上传
        </el-button>
        <el-image v-else :src="fixAvatarUrl(form.avatar)" @click="dialogimage = true">
        </el-image>
      </el-form-item>
    </el-form>
    <!-- 让按钮能固定在表单下面 -->
    <template #footer>
      <el-button @click="submitForm(formref)" type="primary">提交</el-button>

    </template>
  </el-dialog>
  <el-dialog v-model="dialogimage" title="陪护士添加   " :before-close="beforeimg" >
    <div class="img">
    <div v-for="(item,index) in piclist" @click="selectindx=index" class="imgitem">
      <el-icon  class='elicon' v-if="selectindx===index" ><Check/></el-icon>
      <img :src="fixAvatarUrl(item.url)" alt="" :style="{width:'125px'}" class="imginner">
    </div>
  </div>
  <template #footer>
    <el-button type="primary" @click="submitimg">
      提交
    </el-button>
    <el-button @click="dialogimage=false">取消</el-button>
  </template>
  </el-dialog>
  </div>
</template>
<style scoped lang="less">
.header{
  background-color: #fff;

.img{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .imgitem{
    position: relative;
  .elicon{
    position: absolute;
    color:green;
    background-color: aquamarine;
    right:2px;
    top:2px;
    border-radius: 5px;
  }

}
}
:deep(.fanye) {
  background-color: #fff;
  justify-content: flex-end;
}
}
</style>
