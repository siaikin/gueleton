import { createApp } from 'vue'
import App from './App.vue'

import GueletonPlugin from 'unplugin-gueleton/client/vue'
import { GueletonProvider } from 'unplugin-gueleton/client/core'

GueletonProvider.updateOptions({
  // limit: 3,
  limit: { length: 3, properties: ['id', 'name'] },
})

createApp(App)
  .use(GueletonPlugin)
  .mount('#app')
