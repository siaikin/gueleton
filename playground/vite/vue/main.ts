import { createApp } from 'vue'
import { Provider } from 'unplugin-gueleton/client/core'
import GueletonPlugin from 'unplugin-gueleton/client/vue'
import App from './App.vue'
import Antdv from 'ant-design-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

Provider.updateOptions({ bone: { className: 'animate-pulse' } })

createApp(App)
  .use(GueletonPlugin)
  .use(Antdv)
  .use(ElementPlus)
  .mount('#app')

// document.getElementById('app')!.innerHTML = '__UNPLUGIN__'
