<script setup>
defineOptions({
  name:'MainPage'
})
import { onMounted ,ref} from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
// // 拿到当前路由实例
  const route=useRoute()
  // 拿到所有的路由信息
  const router=useRouter()
onMounted(()=>{
   const data=router.options.routes[0]
  //  拿到当前路由在整个路由中的索引看他在第几个
  const index=data.children.findIndex(item=>'/'+item.path===route.path)
  if(index!==-1){
    active.value=index
  }
})
const active=ref(0)
const go=(item)=>{
    router.push('/'+item.path)
}
</script>
<template>
  <div class="container">
  <RouterView></RouterView>
</div>
  <van-tabbar fixed v-model="active" placeholder>
    <van-tabbar-item v-for="item in router.options.routes[0].children" :key="item.path" :icon="item.meta.icon" 
    @click="go(item)">{{ item.meta.name }}</van-tabbar-item>
  </van-tabbar>
  
</template>
<style lang="less" scoped>
.container{
}
</style>