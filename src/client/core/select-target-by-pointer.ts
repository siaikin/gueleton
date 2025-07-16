// import { debounce } from 'lodash-es'

// export function selectTargetByPointer(callback: (element: Element | null, oldElement: Element | null) => void) {
//   const isSupported = !!(document && 'elementFromPoint' in document)

//   let clientX = 0
//   let clientY = 0
//   window.addEventListener('pointermove', debounce((e: PointerEvent) => {
//     clientX = e.clientX
//     clientY = e.clientY
//     update()
//   }, 0))

//   let element: Element | null = null
//   function update() {
//     if (!isSupported)
//       return

//     const newElement = document.elementFromPoint(clientX, clientY)

//     if (!newElement?.isEqualNode(element)) {
//       callback(newElement, element)
//       element = newElement
//     }
//   }

//   return {
//   }
// }
