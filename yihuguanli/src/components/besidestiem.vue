<script setup>
import router from '@/router';
import { useCounterStore } from '@/stores/counter';

//该组件为侧边栏的小部分
defineOptions({ name: 'BesidesItem' })
// 拿到父组件里面传来的值 route路径和 index标记
const props=defineProps(['routedata','index'])
const {routedata}=props
const usecount=useCounterStore()
const {addmenu}=usecount
// 点击组件后会跳转到对应的页面 路由导航
const handleroute=(item,index)=>{
  addmenu(item.meta)
  // 点击后会传递当前组件的id 从而改变sotre里面的记录侧边栏高亮的id 让其为现在所点击的侧边栏 刷新后依然存在
  usecount.updatamenuactive(index)
  router.push(item.meta.path)
}
</script>

<template>
<template v-for="(item,index) in routedata">
  <!-- 没有children则直接渲染 -->
  <el-menu-item @click="handleroute(item, `${props.index}-${item.meta.id}`)" v-if="!(item.children)||item.children.length===0"
  :index="`${props.index}-${item.meta.id}`" :key="`${props.index}-${item.meta.id}`">
    <el-icon size="20">
      <component :is="`${item.meta.icon}`"></component>
    </el-icon>
    <span>{{ item.meta.name }}
     </span>
  </el-menu-item>
 <!-- 有children的情况 -->
  <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`" >
    <template #title>
        <el-icon size="20">
          <component :is="`${item.meta.icon}`"></component>
        </el-icon>

      <span>{{ item.meta.name }}</span>
    </template>
    <!-- 有孩子项则通过递归的形式 将该项中的children项也渲染出来 倘若孩子还有孩子则重复执行 -->
      <besidestiem :key="`${ props.index }-${ item.meta.id }`" :routedata="item.children" :index="`${props.index}-${item.meta.id}`"></besidestiem>
  </el-sub-menu>
</template>
</template>
<style lang="less" scoped></style>
