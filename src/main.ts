import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import LoginDialog from './components/common/LoginDialog/index.vue';
import Register from './components/common/Register/index.vue';
import Head from './components/common/Head/index.vue';
import './styles/common.css'
async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)
  app.component('login-dialog', LoginDialog); // 注册 LoginDialog 组件
  app.component('register-dialog', Register); // 注册 LoginDialog 组件
  app.component('Head', Head); // 注册 Head 组件
  app.use(ElementPlus)
  app.mount('#app')
}

bootstrap()
