import { isNumber } from 'lodash-es'

/**
 *
 * @param rootNode
 * @param getChildren
 * @param callbackFn  回调函数, 返回true表示提前结束遍历
 * @param options  遍历配置项
 * @param options.depth  遍历深度, 从0开始, 默认Number.MAX_SAFE_INTEGER
 */
export function walk<T>(
  rootNode: T,
  getChildren: (node: T) => T[],
  callbackFn: (child: T) => boolean | void,
  options?: { depth?: number },
): void {
  const maxDepth = isNumber(options?.depth) ? Math.max(options.depth, 0) : Number.MAX_SAFE_INTEGER
  callbackFn(rootNode)

  const queue: { depth: number, node: T }[] = [{ depth: 0, node: rootNode }]

  while (queue.length) {
    const { depth, node } = queue.shift()!
    if (depth + 1 > maxDepth)
      continue

    const children = getChildren(node)
    for (const child of children) {
      const earlyReturn = callbackFn(child)
      if (earlyReturn)
        return

      queue.push({ depth: depth + 1, node: child })
    }
  }
}
