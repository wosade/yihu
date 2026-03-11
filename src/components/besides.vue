<script setup>
import { useRouter } from 'vue-router';
import Besidestiem from './besidestiem.vue';
import { reactive, ref } from 'vue';

defineOptions({ name: 'BesideType' })
const router=useRouter();

/* 拿到路由中的全部路径*/
// console.log(router.options.routes);
const routedata=reactive(router.options.routes[0].children)

</script>

<template>
  <div class="besides">
    <el-row class="tac">
      <el-col :span="12">
        <h5 class="mb-2">Custom colors</h5>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
          text-color="#fff" @open="handleOpen" @close="handleClose">
          <p class="log">123</p>
          <Besidestiem :index=1 :routedata="routedata"></Besidestiem>
        </el-menu>
      </el-col>
    </el-row>
  </div>

  <RouterView />
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
  height: 100vh;
  width: 200px;
}
</style>
