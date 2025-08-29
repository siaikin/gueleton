import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { GueletonProvider } from 'unplugin-gueleton/client/core'
import GueletonPlugin from 'unplugin-gueleton/client/vue'
import ui from '@nuxt/ui/vue-plugin'

GueletonProvider.updateOptions({ skeleton: { bone: { className: 'animate-pulse' } } })

createApp(App).use(GueletonPlugin).use(ui).mount('#app')
