import { cloneDeep, isArray, isNumber, isPlainObject, merge, pick } from 'lodash-es'

interface Options {
  /**
   * 取前 length 项, 仅对数组有效. 当 length 为 0 时, 不裁剪.
   */
  length: number
  /**
   * - 当 data 为对象, 仅保留 properties 中列出的属性.
   * - 当 data 为数组, 应用于每个数组项.
   */
  properties: string[]
}

export type PruneOptions = Partial<Options> | number

/**
 * 根据 limit 配置裁剪数据
 */
export function prune<T extends []>(data: T, limit?: PruneOptions): Array<Record<string, any>>
export function prune<T extends object>(data: T, limit?: PruneOptions): Record<string, any>
export function prune<T>(data: T, limit?: PruneOptions): any {
  const pruneOptions: Options = merge({ length: 0, properties: [] }, isNumber(limit) ? { length: limit, properties: [] } : limit)

  if (isArray(data)) {
    return data.slice(0, pruneOptions.length || undefined).map(item => pruneObject(item, pruneOptions.properties))
  }
  else if (isPlainObject(data)) {
    return pruneObject(data as object, pruneOptions.properties)
  }

  return data
}

function pruneObject<T extends object>(data: T, properties: string[]): Record<string, any> {
  if (properties.length <= 0) {
    return cloneDeep(data)
  }
  else {
    return cloneDeep(pick(data, properties))
  }
}

// export function autoPrune<T extends []>(data: T, limit: PruneOptions): { proxyed: T, getPrune: () => Array<Record<string, any>> }
// export function autoPrune<T extends object>(data: T, limit: PruneOptions): { proxyed: T, getPrune: () => Record<string, any> }
// export function autoPrune<T>(data: T, limit: PruneOptions): { proxyed: T, getPrune: () => any } {

// }

// const original = { a: '1', c: '2', d: { e: '3' } }
// const affected = new WeakMap()
// const proxy = createProxy(original, affected)

// console.log(proxy.a)
// console.log(proxy.d.e)

// console.log(affectedToPathList(original, affected))
