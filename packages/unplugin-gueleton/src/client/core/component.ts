import type { SkeletonOptions } from './options'

export type ComponentProps<DATA, CSSTYPE> = {
  /**
   * 标记预存数据的 key, 可以在在面板中查看和操作预存数据.
   * 相同的 key 将共享相同的预存数据.
   */
  dataKey: string
  /**
   * 代理的原始数据. gueleton 将根据原始数据和 limit 参数生成预存数据.
   */
  data: DATA | null | undefined
  /**
   * 这个参数可以让你直接在代码中设置预存数据, 而不依赖构建时的 vite/webpack 插件.
   *
   * 注意: 在这里手动设置的 prestoreData 不会被保存到 devServer.
   */
  prestoreData?: DATA | null | undefined
  /**
   * 控制是否显示骨架屏.
   */
  loading?: boolean
  /**
   * 强制渲染组件, 即使没有预存数据.
   */
  forceRender?: boolean
} & Partial<SkeletonOptions<CSSTYPE>>
