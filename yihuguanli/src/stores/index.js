import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 1. 创建实例
const pinia = createPinia()

// 2. 安装插件
pinia.use(piniaPluginPersistedstate)

// 3. 导出实例
export default pinia
