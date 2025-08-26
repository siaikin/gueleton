import type { ParentProps } from 'solid-js'
import { children, createEffect, splitProps } from 'solid-js'

interface SlotProps extends ParentProps {
  ref?: (el: HTMLElement) => void
}

// eslint-disable-next-line ts/explicit-function-return-type
export function Slot(props: SlotProps) {
  const [local] = splitProps(props, ['children', 'ref'])
  const resolved = children(() => local.children)
  createEffect(() => {
    local.ref = resolved.toArray()[0]
    console.log(resolved)
  })

  return resolved()
}
