import type { SkeletonPluginFactory } from '../../shared'
import type { SkeletonOptions } from './options'
import { preprocessPlugin, skeletonInPlacePlugin, skeletonOverlayPlugin } from './plugins'

export function skeleton<CSSTYPE>(dom: Node, options: SkeletonOptions<CSSTYPE>): () => void {
  if (!skeletonSourceElementCheck(dom)) {
    // maybe error log
    return () => {}
  }

  const plugins: SkeletonPluginFactory<CSSTYPE>[] = [
    preprocessPlugin,
  ]

  switch (options.type) {
    case 'inPlace':
      plugins.push(skeletonInPlacePlugin)
      break
    case 'overlay':
      plugins.push(skeletonOverlayPlugin)
      break
    default:
      throw new Error(`Unknown skeleton type: ${options.type}`)
  }

  const unmountList = plugins.map((plugin) => {
    const { mount, unmount } = plugin(dom, options)
    mount()
    return unmount
  })

  return () => {
    unmountList.forEach(unmount => unmount())
  }
}

function skeletonSourceElementCheck(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE
}
