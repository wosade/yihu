import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // 代表侧边栏是否展开
  const isCollapse = ref(false)
  // 存储已打开的页面
  const menudata=ref([])
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
  return { isCollapse,Changecollapse,menudata,addmenu,delmenu}
})
