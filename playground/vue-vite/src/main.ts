import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { GueletonProvider } from 'unplugin-gueleton/client/core'
import GueletonPlugin from 'unplugin-gueleton/client/vue'

GueletonProvider.updateOptions({ bone: { className: 'animate-pulse' } })

createApp(App).use(GueletonPlugin).mount('#app')
