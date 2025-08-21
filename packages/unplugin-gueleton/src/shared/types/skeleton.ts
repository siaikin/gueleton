import type * as CSS from 'csstype'

export interface Skeleton {
  id: string
  tree: SkeletonTreeNode
}

export interface SkeletonTreeNode {
  /**
   * 节点样式
   */
  style: CSS.StandardProperties & CSS.StandardPropertiesHyphen
  /**
   * 节点类名, 多个类名用空格隔开
   */
  className: string
  tag: string
  attrs: Record<string, string>
  children: SkeletonTreeNode[]
}
