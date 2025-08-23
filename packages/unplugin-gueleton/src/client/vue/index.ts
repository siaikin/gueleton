import type { App, Component, Plugin } from 'vue'
import Gueleton from './gueleton.vue'

export const GueletonPlugin: Plugin = {
  install: (app: App) => {
    app.component('Gueleton', Gueleton as unknown as Component)
  },
}

export type * from './global'
export { Gueleton }

export default GueletonPlugin
