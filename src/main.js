
import { createApp } from "vue";
import App from "./App.vue";
import PanelHead from "./components/PanelHead.vue";
import router from "./router";
import '@/assets/common.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useCounterStore } from "./stores/counter";
import pinia from "./stores/index";
// 路由守卫
// 通过插件实现 sotre本地持久化存储

router.beforeEach((to,from)=>{
  const token=localStorage.getItem('token')
  if(!token&&to.path!='/login'){
    return '/login'
  }
  else if(to.path==='/login'&&token){
    return '/'
  }
  else{
   return true
  }
})

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia);


const data =JSON.parse(localStorage.getItem('data'))
const storecount = useCounterStore(pinia)
if (data) {
  if(data.routerList){
  storecount.dynamicmenu(data.routerList)
  storecount.routerList.forEach(item => {
    router.addRoute('main', item)
  })}
}
app.use(router);
app.mount("#app");
