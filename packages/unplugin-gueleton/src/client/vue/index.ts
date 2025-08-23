import type { App, Plugin } from 'vue'
import { Gueleton } from './gueleton'

export const GueletonPlugin: Plugin = {
  install: (app: App) => {
    app.component('Gueleton', Gueleton)
  },
}

export type * from './global'
export * from './gueleton'

export default GueletonPlugin
