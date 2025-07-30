import type { SkeletonOptions, SkeletonPluginFactory } from '../../shared'
import { preprocessPlugin, skeletonInPlacePlugin, skeletonOverlayPlugin } from './plugins'

export { prune, type PruneOptions } from './prune'

export function skeleton<CSSTYPE>(dom: HTMLElement, options: SkeletonOptions<CSSTYPE>): () => void {
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
