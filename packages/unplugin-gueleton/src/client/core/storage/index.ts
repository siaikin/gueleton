import { DevelopmentStorage } from './dev'
import { ProductionStorage } from './prod'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const buildMode = __GUELETON_BUILD_MODE__ as 'production' | 'development'

export interface SkeletonStorage {
  getItem: (key: string) => Promise<string | null>
  removeItem: (key: string) => Promise<void>
  setItem: (key: string, value: string) => Promise<void>
}

export const PrestoreDataStorage = buildMode === 'production' ? new ProductionStorage() : new DevelopmentStorage()
