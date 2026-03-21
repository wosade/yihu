<script setup>
defineOptions({
  name: 'VppzOrder'
})
import { adminOrder } from '@/api';
import PanelHead from '@/components/PanelHead.vue';
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { InfoFilled,Delete } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
const route=useRoute()
const listpage=reactive({
  pageNum:1,
  pageSize:5
})
onMounted(()=>{
  getData()
})
const tableData=reactive({
  length:[],
  total:0
})
// 列表的数据
const getData=()=>{
  adminOrder(listpage).then(({data})=>{
    const {list,total}=data.data
    tableData.length=list
    tableData.total=total
  })
}
// 翻页函数
const handleSizeChange = (val) => {
  listpage.pageSize = val
  getData()
}
const handleCurrentChange = (val) => {
  listpage.pageNum = val
  getData()
}
</script>
<template>
  <PanelHead :route="route"/>
  <!-- 列表详情-->
  <el-table :data="tableData.length">
  <el-table-column prop="out_trade_no" label="订单号"></el-table-column>
  <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
  <el-table-column prop="service_name" label="就诊服务"></el-table-column>
    <el-table-column label="陪诊师头像">
      <template #default="scope">
        <el-image style="width: '40px',height='40px'" :src="scope.row.companion.avatar"></el-image>
      </template>
    </el-table-column>
    <el-table-column label="陪诊师手机号" width="120">
      <template #default="scope">
        {{ scope.row.companion.mobile }}
      </template>
    </el-table-column>
    <el-table-column prop="price" label="总价"></el-table-column>
    <el-table-column prop="paidPrice" label="已付"></el-table-column>
    <el-table-column label="下单时间">
      <template #default="scope">
        {{ dayjs(scope.row.order_start_tiem).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态"></el-table-column>
    <el-table-column prop="tel" label="联系人手机号"></el-table-column>
    <el-table-column  label="操作" fixed="right">
      <template #default="scope">
        <el-popconfirm  v-if="scope.row.trade_state==='待服务'" width="220" :icon="Delete" icon-color="#626AEF" title="你确定要选择完成吗?"
          confirm-button-text="是" cancel-button-text="否" @confirm="confirmEvent">
          <template #reference>
            <el-button type="primary">服务完成</el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="primary" link disabled>暂无服务</el-button>
      </template>
    </el-table-column>
</el-table>
  <!-- 分页逻辑 -->
  <div class="demo-pagination-block">
    <div class="demonstration"></div>
    <el-pagination v-model:current-page="listpage.pageNum" v-model:page-size="listpage.pageSize" :background="false"
      layout=" prev,pager, next, jumper" :total="tableData.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" class="fanye" />
  </div>
</template>
<style scoped>
:deep(.fanye) {
  background-color: #fff;
  justify-content: flex-end;
}
</style>
