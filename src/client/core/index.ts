export { domToSkeleton } from './dom-to-skeleton'
export { prune, type PruneOptions } from './prune'
export { skeletonToDom } from './skeleton-to-dom'

// (function () {
//   function handleCreateSkeleton(event: Event): void {
//     const element = event.target as HTMLElement

//     const temp = domToSkeleton(element, { quality: 0 })
//     const dom = skeletonToDom(temp)

//     element.appendChild(dom)
//   }

//   const overlay = document.createElement('div')
//   overlay.style.position = 'absolute'
//   overlay.style.top = '0'
//   overlay.style.left = '0'
//   overlay.style.width = '0'
//   overlay.style.height = '0'
//   overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
//   overlay.style.zIndex = '9999'
//   overlay.style.pointerEvents = 'none'
//   overlay.style.transition = 'all 0.05s linear'
//   document.body.appendChild(overlay)

//   selectTargetByPointer((element, oldElement) => {
//     overlay.style.top = '0'
//     overlay.style.left = '0'
//     overlay.style.width = '0'
//     overlay.style.height = '0'

//     if (element) {
//       const bbox = element.getBoundingClientRect()
//       overlay.style.top = `${bbox.top + window.scrollY}px`
//       overlay.style.left = `${bbox.left + window.scrollX}px`
//       overlay.style.width = `${bbox.width}px`
//       overlay.style.height = `${bbox.height}px`
//       element.addEventListener('click', handleCreateSkeleton)
//     }

//     if (oldElement) {
//       oldElement.removeEventListener('click', handleCreateSkeleton)
//     }
//   })
// })()
