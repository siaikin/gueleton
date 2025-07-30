import { isNil, isNumber, isSymbol } from 'lodash-es'

/**
 * 提前结束遍历
 */
export const EarlyReturn = Symbol('earlyReturn')
/**
 * 跳过当前节点的子节点遍历
 */
export const SkipChildren = Symbol('skipChildren')
/**
 * 追加当前节点的子节点遍历
 */
export const AppendChildren = Symbol('appendChildren')
export type WalkFlag = typeof EarlyReturn | typeof SkipChildren | typeof AppendChildren

const _withFlagKey = Symbol('withFlagKey')

/**
 * 遍历树结构
 * @param rootNode 根节点
 * @param getChildren 获取子节点的函数
 * @param callbackFn  回调函数, 接收当前遍历的子节点和父节点作为参数，返回 `WalkFlag` 表示遍历行为. 返回空值的行为与 `AppendChildren` 相同.
 * 当前遍历的子节点为根节点时, 父节点为 `null`.
 * @param options  遍历配置项
 * @param options.depth  遍历深度, 从0开始, 默认Number.MAX_SAFE_INTEGER
 */
export function walk<T>(
  rootNode: T,
  getChildren: (node: T) => T[],
  callbackFn: (child: T, parent: T | null) => WalkFlag | void,
  options?: { depth?: number },
): void {
  const maxDepth = isNumber(options?.depth) ? Math.max(options.depth, 0) : Number.MAX_SAFE_INTEGER
  callbackFn(rootNode, null)

  const queue: { depth: number, node: T }[] = [{ depth: 0, node: rootNode }]

  while (queue.length) {
    const { depth, node } = queue.shift()!
    if (depth + 1 > maxDepth)
      continue

    const children = getChildren(node)
    for (const child of children) {
      const walkFlag = callbackFn(child, node)
      switch (walkFlag) {
        case EarlyReturn:
          return
        case SkipChildren:
          continue
        case AppendChildren:
        default: {
          queue.push({ depth: depth + 1, node: child })
        }
      }
    }
  }
}

// function _withFlag(flag?: WalkFlag): { node: undefined, [_withFlagKey]: WalkFlag }
// function _withFlag<U>(node: U, flag?: WalkFlag): { node: U, [_withFlagKey]: WalkFlag }
function _withFlag<U>(node: U | WalkFlag = AppendChildren, flag: WalkFlag = AppendChildren): { node: U | null, [_withFlagKey]: WalkFlag } {
  if (isSymbol(node)) {
    return { node: null, [_withFlagKey]: node }
  }
  else {
    return { node, [_withFlagKey]: flag }
  }
}
type WithFlagFunc<U> = typeof _withFlag<U>

function _resolveFlag<U extends object>(nodeWithFlag: U | WalkFlag | ReturnType<WithFlagFunc<U>>): { node: U | null, flag: WalkFlag } {
  if (isSymbol(nodeWithFlag)) {
    return { node: null, flag: nodeWithFlag }
  }
  else if (_withFlagKey in nodeWithFlag) {
    return { node: nodeWithFlag.node, flag: nodeWithFlag[_withFlagKey] }
  }
  else {
    return { node: nodeWithFlag, flag: AppendChildren }
  }
}

/**
 * 遍历树结构, 并将遍历结果映射到新的树结构
 * @param rootNode 与 {@link walk} 中 `rootNode` 相同
 * @param getChildren 与 {@link walk} 中 `getChildren` 相同
 * @param callbackFn  回调函数, 接收当前遍历的子节点、父节点、映射后的父节点和 `withFlag` 函数作为参数.
 * @param options 与 {@link walk} 中 `options` 相同
 * @returns 映射后的根节点
 */
export function walkWithMap<T extends object, U extends object>(
  rootNode: T,
  getChildren: (node: T) => T[],
  callbackFn: (child: T, parent: T | null, mappedParent: U | null, withFlag: WithFlagFunc<U>) => U | WalkFlag | ReturnType<WithFlagFunc<U>>,
  options?: { depth?: number },
): U | null {
  const map = new Map<T, U>()
  let rootMirrorNode: U | null = null

  walk(rootNode, getChildren, (child, parent) => {
    const mappedParent = parent ? map.get(parent) ?? null : null

    const { node, flag } = _resolveFlag(callbackFn(child, parent, mappedParent, _withFlag))

    if (!isNil(node)) {
      map.set(child, node)
    }

    if (parent === null) {
      rootMirrorNode = node
    }

    return flag
  }, options)

  return rootMirrorNode
}
