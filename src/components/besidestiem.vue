<script setup>
//该组件为侧边栏的小部分
defineOptions({ name: 'BesidesItem' })
// 拿到父组件里面传来的值 route路径和 index标记
const props=defineProps(['routedata','index'])
console.log(props.routedata);
const {routedata}=props
</script>

<template>
<template v-for="(item,index) in routedata">

  <!-- 没有children则直接渲染 -->
  <el-menu-item v-if="!(item.children)||item.children.length===0"
  :index="`${props.index}-${item.meta.id}`" :key="`${props.index}-${item.meta.id}`">
    <el-icon size="20">
      <component :is="`${item.meta.icon}`"></component>
    </el-icon>
    <span>{{ item.meta.name }}{{props.index }}-{{item.meta.id}}
     </span>
  </el-menu-item>
 <!-- 有children的情况 -->
  <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`" >
    <template #title>
      <el-icon>
        <location />
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </template>
    <!-- 有孩子项则通过递归的形式 将该项中的children项也渲染出来 倘若孩子还有孩子则重复执行 -->
      <besidestiem :key="`${ props.index }-${ item.meta.id }`" :routedata="item.children" :index="`${props.index}-${item.meta.id}`"></besidestiem>
  </el-sub-menu>
</template>
</template>
<style lang="less" scoped></style>
