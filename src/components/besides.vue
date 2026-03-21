<script setup>
import { useRoute, useRouter } from 'vue-router';
import Besidestiem from './besidestiem.vue';
import { useCounterStore } from '@/stores/counter';
import { computed, reactive } from 'vue';
import { watch,ref } from 'vue';
defineOptions({ name: 'BesideType' })
const router=useRouter();
// 判断侧边栏是否展开
const iscollapse=computed(()=>usecounterstore.isCollapse)
const usecount=useCounterStore()
/* 拿到路由中的全部路径*/
// const routedata=reactive(router.options.routes[0].children)
// 此时拿到的是store里面的动态路由只会渲染 用户拥有的权限
const active=computed(()=>usecounterstore.menuactive)

const route = useRoute();
const usecounterstore = useCounterStore();
const routedata = usecounterstore.routerList;

// 定义一个响应式变量存当前高亮的 ID
const activeId = ref('');

// 递归查找函数：根据 path 找对应的复合 ID
const findIdByPath = (data, path, parentIndex = '1') => {
  for (const item of data) {
    // 生成当前项的复合 ID
    const currentId = `${parentIndex}-${item.meta.id}`;

    // 如果路径匹配，返回 ID
    if (item.meta.path === path) {
      return currentId;
    }

    // 如果有子项，递归查找
    if (item.children && item.children.length > 0) {
      const found = findIdByPath(item.children, path, currentId);
      if (found) return found;
    }
  }
  return '';
};

// 监听路由变化，实时更新高亮 ID
watch(
  () => route.path,
  (newPath) => {
    const id = findIdByPath(routedata, newPath);
    if (id) {
      activeId.value = id;
      // 同步到 store，保证刷新后的状态
      usecounterstore.updatamenuactive(id);
    }
  },
  { immediate: true } // 立即执行，确保页面首次加载就能定位
);
</script>


<template>
  <!-- 判断边框是否折叠改变边框的宽度 -->
        <el-menu :style="{width: iscollapse? '64px':'230px',}" active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" :default-active="active"
          text-color="#fff" :collapse="iscollapse" >
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
