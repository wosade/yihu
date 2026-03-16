<script setup>
import { useRouter } from 'vue-router';
import Besidestiem from './besidestiem.vue';
import { useCounterStore } from '@/stores/counter';
import { computed, reactive } from 'vue';
defineOptions({ name: 'BesideType' })
const router=useRouter();
const usecounterstore=useCounterStore()
// 判断侧边栏是否展开
const iscollapse=computed(()=>usecounterstore.isCollapse)

/* 拿到路由中的全部路径*/
const routedata=reactive(router.options.routes[0].children)

</script>

<template>
  <!-- 判断边框是否折叠改变边框的宽度 -->
        <el-menu :style="{width: iscollapse? '64px':'230px',}" active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
          text-color="#fff" :collapse="iscollapse">
          <p class="log">{{ iscollapse?'陪诊':'陪诊管理' }}</p>
          <Besidestiem :index=1 :routedata="routedata"></Besidestiem>
        </el-menu>



</template>

<style lang="less" scoped>
.log {
  text-align: center;
  font-size: 20px;
  height: 50px;
  line-height: 50px;
  color: #fff;
}

.el-menu {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  height: 100vh;
}
</style>
