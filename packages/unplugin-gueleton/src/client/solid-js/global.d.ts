declare global {
  interface HTMLElement {
    dataset: DOMStringMap & {
      gueletonBone: string
    }
  }
}

export {}
