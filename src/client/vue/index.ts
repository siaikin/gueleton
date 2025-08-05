import type { App, Plugin } from 'vue'
import { Gueleton } from './gueleton'
import { GueletonProvider } from './gueleton-provider'

export const GueletonPlugin: Plugin = {
  install: (app: App) => {
    app.component('Gueleton', Gueleton)
    app.component('GueletonProvider', GueletonProvider)
  },
}

export type * from './global.d'
export * from './gueleton'
export * from './gueleton-provider'

export default GueletonPlugin
