import type Gueleton from './gueleton.vue'

declare module 'vue' {
  interface GlobalComponents {
    Gueleton: typeof Gueleton
  }
  interface ComponentCustomProps {
    dataGueletonBone?: boolean | string
  }
}

declare global {
  interface HTMLElement {
    dataset: DOMStringMap & {
      gueletonBone: string
    }
  }
}
