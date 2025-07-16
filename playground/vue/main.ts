import { createApp } from 'vue'
import GueletonPlugin from '../../src/client/vue'
import App from './App.vue'

createApp(App)
  .use(GueletonPlugin)
  .mount('#app')

// document.getElementById('app')!.innerHTML = '__UNPLUGIN__'
