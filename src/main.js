
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import '@/assets/common.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 路由守卫
router.beforeEach((to,from)=>{
  const token=localStorage.getItem('token')
  if(!token&&to.path!='/login'){
    return '/login'
  }
  else{
   return true
  }
})
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia());
app.use(router);
app.mount("#app");
