<script setup>
import { useCounterStore } from '@/stores/counter';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 查看当前页面路由
const route = useRoute()
const router = useRouter()
const usercounterstore = useCounterStore()
const { addmenu, delmenu } = usercounterstore
const menudata = computed(() => {
  return usercounterstore.menudata })
const closetab = (item, index) => {
  delmenu(item, index)
  console.log(menudata);
  //computed返回的是ref对象要用value访问
  const menu = menudata.value
  // 如果删的是最后一个 跳转到主页面 "/"
  if (menu.length === 0) {
    // const uter=useRouter()
    router.push('/')
  }


  // 如果删除的页面不是当前页面则什么也不做
  else if (route.path !== item.path) {
    return
  }
  // 如果删的是最后一个则往前一个
  else if (index === menu.length) {
    router.push(menu[index - 1].path)
  }
  //如果删的是中间的一个 则往后去一个
  else {
    router.push(menu[index].path)
  }
}
const handleclik=(command)=>{
// 点击退出时清空token 和userinfo
  if(command==='cancel'){
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('data')
  router.push('/login')}
}
// 得到用户信息
const userinfo=JSON.parse(localStorage.getItem('userInfo'))

</script>

<template>
  <div class="header">
    <div class="header-left flex-box">
      <!-- 点击后改变侧边栏收缩情况 -->
      <el-icon @click="usercounterstore.Changecollapse()" class="icon" size="20">
        <Operation />
      </el-icon>

      <ul class="flex-box ">
        <!-- 通过路由来判断所在路由页面-->
        <li v-for="(item, index) in menudata" :key="item.path" class="flex-box tab"
          :class="{ selected: route.path === item.path }">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <RouterLink class="text flex-box selected" :to="item.path">
            {{ item.name }}</RouterLink>
          <el-icon class="close" @click="closetab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>

    <div class=" header-right">
      <!-- 当下拉栏被点击时触发 -->
      <el-dropdown @command="handleclik">
        <div class="flex-box" >
          <el-avatar :src="userinfo.avatar" />
          <p class="user-name">{{ userinfo.name }}</p>
        </div>

      <template #dropdown>
        <el-dropdown-menu>
        <el-dropdown-item command="cancel">
          退出
        </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    </div>

    </div>
</template>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;

  .header-left {
    height: 100%;

    .icon {
      width: 45px;
      height: 100%;
    }

    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .tab {
      padding: 0 10px;
      height: 100%;

      .text {
        margin: 0 5px;
      }

      .close {
        visibility: hidden;
      }

      &.selected {
        a {
          color: #409eff;
        }

        i {
          color: #409eff;
        }

        background-color: #f5f5f5;
      }
    }

    .tab:hover {
      background-color: #f5f5f5;

      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }

 .header-right {
    .user-name{
      margin-left: 10px ;
      height: 100%;
        color: #333;
        font-size: 15px;
    }
  }

  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>
