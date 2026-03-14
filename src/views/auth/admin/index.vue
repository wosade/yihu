<script setup>
defineOptions({
  name:'AdminPart'
})
import { manageuser } from '@/api/index'
import { reactive } from 'vue';
const admin=reactive(
  {
    pageNum:1,
    pageSize:5
  }
)
manageuser(admin).then(
  ({data})=>{
    console.log(data);

  }
)
</script>
<template>
  <div class="admin">
    <h1>管理员页面</h1>
    <p>欢迎来到管理员页面！这里是管理员专用的内容。</p>
  </div>
</template>
<style scoped>
</style>
