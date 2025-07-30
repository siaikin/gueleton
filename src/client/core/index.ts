import type { SkeletonOptions, SkeletonPlugin } from '../../shared'
import { preprocessPlugin, skeletonInPlacePlugin, skeletonOverlayPlugin } from './plugins'

export { prune, type PruneOptions } from './prune'

export function skeleton<CSSTYPE>(dom: HTMLElement, options: SkeletonOptions<CSSTYPE> & { inPlace?: boolean }): () => void {
  const plugins: SkeletonPlugin<CSSTYPE>[] = [
    preprocessPlugin,
  ]

  if (options.inPlace) {
    plugins.push(skeletonInPlacePlugin)
  } else {
    plugins.push(skeletonOverlayPlugin)
  }

  const unmountList = plugins.map(plugin => {
    const { name, mount, unmount } = plugin(dom, options)
    mount()
    return unmount
  })

  return () => {
    unmountList.forEach(unmount => unmount())
  }
}
