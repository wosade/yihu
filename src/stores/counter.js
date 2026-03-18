import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import router from '@/router'
// 获取到本地内存所存储的 counter数据
const localData=localStorage.getItem('data')
export const useCounterStore = defineStore('counter', () => {
  // 代表侧边栏是否展开
  const isCollapse = ref(false)
  // 存储已打开的页面
  const menudata=ref([])
  const routerList=ref([])
  function Changecollapse() {
    isCollapse.value=!isCollapse.value
    console.log(isCollapse.value);
  }
  // 判断页面是否打开 未打开则添加到menudata中
  function addmenu(pay){
     if(menudata.value.findIndex(item=>item.path===pay.path)===-1)
      menudata.value.push(pay)
    console.log(menudata.value);

  }
  // 删除顶部菜单里面的导航所选项
   function delmenu(item,index){
    //item表示删除的项 index 表示在数组中的索引
    menudata.value=menudata.value.filter((value)=>{
      return value!==item
    })
    console.log(item,menudata.value.length);

  }
  const getrouter=reactive(router.options.routes[0].children)

  function dynamicmenu(payload){

    // 通过vite自带的glob导入文件能够批量得到veiws中的文件的路径
    const modules=import.meta.glob('../views/**/**/*.vue')
    console.log(modules);
    routerList.value=payload
    // 把后台传过来的菜单权限列表数组 与views中的组件 进行匹配赋值
    function routerset(router){
      if(!router)return
      router.forEach((item,index)=>{
        if(!item.children){
          // 拼接路径 让从后端的到的权限列表的路径等于上面的文件的路径
          const url=`../views${item.meta.path}/index.vue`
          //得到对应路径的组件
          item.component=modules[url]
        }else{
          // 有孩子就继续递归
          routerset(item.children)
        }
      })
    }
      routerset(payload)
      // 拿到完整的路由数据
      routerList.value=payload
      console.log(routerList);

  }
  return { isCollapse,Changecollapse,menudata,addmenu,delmenu,dynamicmenu,getrouter,routerList}
}, {
  persist: {
    key:'data',
    // 【关键配置】在这里列出你想要存储的变量名
    // 没写在这里的（比如 routerList）在页面刷新后会变回初始值
    paths: ['isCollapse', 'routerList']
  }})
