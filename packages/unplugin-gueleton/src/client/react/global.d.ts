import type Gueleton from './gueleton'

declare module 'react' {
  interface HTMLAttributes<T> {
    'data-gueleton-bone'?: boolean | string
  }
}

// 全局组件类型
declare global {
  namespace JSX {
    interface IntrinsicElements {
      Gueleton: React.ComponentProps<typeof Gueleton<any>>
    }
  }

  interface HTMLElement {
    dataset: DOMStringMap & {
      gueletonBone: string
    }
  }
}

export {}
