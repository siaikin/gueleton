import type { App, Plugin } from 'vue'
import { Gueleton } from './gueleton'
import { GueletonProvider } from './gueleton-provider'

const GueletonPlugin: Plugin = {
  install: (app: App) => {
    app.component('Gueleton', Gueleton)
    app.component('GueletonProvider', GueletonProvider)
  },
}

export {
  Gueleton,
  GueletonProvider,
}

export default GueletonPlugin
