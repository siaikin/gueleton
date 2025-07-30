import { kebabCase } from 'lodash-es'

export function setupMountPoint(mountPoint: HTMLElement): void {
  // const nodeName = mountPoint.nodeName.toLowerCase()
  const styleMap = mountPoint.computedStyleMap()

  const position = styleMap.get('position')?.toString()
  switch (position) {
    case 'static':
      mountPoint.style.setProperty('position', 'relative')
      mountPoint.dataset.originalPosition = position
      break
  }

  const display = styleMap.get('display')?.toString()
  switch (display) {
    case 'inline':
      mountPoint.style.setProperty('display', 'inline-block')
      mountPoint.dataset.originalDisplay = display
      break
  }
}

export function resetMountPoint(mountPoint: HTMLElement): void {
  const entries = Object.entries(mountPoint.dataset)
    .filter(([key]) => key.startsWith('original'))
    .map(([key, value]) => [key.replace('original', ''), value] as const)

  for (const [key] of entries) {
    delete mountPoint.dataset[key]
  }

  for (const [key, value] of entries) {
    mountPoint.style.setProperty(kebabCase(key), value || 'unset')
  }
}
