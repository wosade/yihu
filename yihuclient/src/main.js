
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import api from './api'
import 'vant/lib/index.css';
const app = createApp(App)
// 挂载 request接口api
app.config.globalProperties.$api=api
app.use(createPinia())
app.use(router)

app.mount('#app')
