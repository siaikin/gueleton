export interface SkeletonStorage {
  getItem: (key: string) => Promise<string | null>
  removeItem: (key: string) => Promise<void>
  setItem: (key: string, value: string) => Promise<void>
}

export * from './dev'
export * from './prod'
