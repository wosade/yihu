<script setup>
import Besides from '@/components/besides.vue';
import Header from '@/components/Header.vue';

defineOptions({
  name: 'VppzMain'
})
</script>
<template>
    <div class="common-layout">
      <el-container class="container">
        <el-aside ><Besides></Besides></el-aside>
        <el-container>
          <el-header><Header></Header></el-header>
          <el-main><RouterView></RouterView></el-main>
        </el-container>
      </el-container>
    </div>




</template>
<style scoped lang="less">
.el-aside{
  display: inline-block;
  width: fit-content;
}
</style>
