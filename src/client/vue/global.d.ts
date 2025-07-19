import type { Gueleton } from './gueleton'
import type { GueletonProvider } from './gueleton-provider'

declare module 'vue' {
  interface GlobalComponents {
    Gueleton: typeof Gueleton
    GueletonProvider: typeof GueletonProvider
  }
  interface ComponentCustomProps {
    dataGueletonBone: string
  }
}

declare global {
  interface HTMLElement {
    dataset: DOMStringMap & {
      gueletonBone: string
    }
  }
}
