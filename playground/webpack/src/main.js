import { createApp } from 'vue'
import App from './App.vue'
import GueletonPlugin from 'unplugin-gueleton/client/vue'
import './assets/tailwind.css'

createApp(App).use(GueletonPlugin).mount('#app')
