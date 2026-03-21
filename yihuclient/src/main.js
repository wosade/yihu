
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import api from './api'
import 'vant/lib/index.css';
const app = createApp(App)
// 挂载 request接口api
app.config.globalProperties.$api=api
// 路由守卫
// 通过插件实现 sotre本地持久化存储
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  if (!token && to.path != '/login') {
    return '/login'
  }
  else if (to.path === '/login' && token) {
    return '/'
  }
  else {
    return true
  }
})
app.use(createPinia())
app.use(router)
app.mount('#app')
