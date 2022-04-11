import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from './store'
import plugin from './plugin'

const app = createApp(App)
//动态注入全局组件（全局组件请放在global）
const coms = import.meta.globEager('./components/global/*.vue')
for (const key in coms) {
  var component = coms[key].default;
  app.component(
    component.name,
    component
  )
}
app.use(plugin).use(router).use(ElementPlus).use(store).mount('#app')
