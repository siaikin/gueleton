import { createApp } from 'vue'
import App from './App.vue'
import GueletonPlugin from 'unplugin-gueleton/client/vue'
import { Provider } from 'unplugin-gueleton/client/core'

Provider.updateOptions({ bone: { className: 'animate-pulse' } })

createApp(App).use(GueletonPlugin).mount('#app')
