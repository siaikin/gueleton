export interface Skeleton {
  id: string
  tree: SkeletonTreeNode
}

export interface SkeletonTreeNode {
  style: Record<string, string>
  tag: string
  attrs: Record<string, string>
  children: SkeletonTreeNode[]
}
