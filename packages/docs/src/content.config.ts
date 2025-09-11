import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// 定义支持的框架类型
export type FrameworkKey = 
  | 'vue'
  | 'react'
  | 'solidjs'
  | 'svelte'
  | 'angular'
  | 'vanilla';

// 定义支持的打包工具类型
export type BoundlerKey = 
  | 'vite'
  | 'webpack'
  | 'rollup'
  | 'esbuild'
  | 'rspack'
  | 'farm'
  | 'astro'
  | 'nuxt'
  | 'vue-cli'
  | "bun"
  | "next"
  | "sveltekit";

// 自定义 TOC 节点类型
export type TocNode = {
  text: string;
  anchor: string;
  framework?: FrameworkKey | FrameworkKey[];
  children?: TocNode[];
};

export const collections = {
	docs: defineCollection({ 
    loader: docsLoader(), 
    schema: docsSchema({
      extend: z.object({
        // 支持的框架列表
        frameworks: z.custom<FrameworkKey[]>().optional(),
      }),
    })
  }),
};
