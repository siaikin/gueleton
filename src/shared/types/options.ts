export interface SkeletonOptions {
  /**
   * 精度.
   */
  quality: number
  radius: number
  color: string
  backgroundColor: string
}

export const DefaultSkeletonOptions: SkeletonOptions = {
  quality: 1,
  radius: 8,
  color: 'rgba(0, 0, 0, 0.06)',
  backgroundColor: 'rgba(255, 255, 255, 1)',
}
