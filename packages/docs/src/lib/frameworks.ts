import type { BoundlerKey, FrameworkKey } from '../content.config';

export interface Framework {
  key: FrameworkKey;
  name: string;
  displayName: string;
  logo: string;
  category: 'bundler' | 'meta-framework' | 'ui-framework';
  boundlers: BoundlerKey[];
}

export const frameworks: Framework[] = [
  // 构建工具/打包器
  {
    key: 'vue',
    name: 'Vue',
    displayName: 'Vue',
    logo: 'vue',
    category: 'ui-framework',
    boundlers: ['vite', 'webpack', 'vue-cli', 'nuxt']
  },
  {
    key: 'react',
    name: 'React',
    displayName: 'React',
    logo: 'react',
    category: 'ui-framework',
    boundlers: ['vite', 'webpack', 'next']
  },
  {
    key: 'solidjs',
    name: 'SolidJS',
    displayName: 'SolidJS',
    logo: 'solidjs',
    category: 'ui-framework',
    boundlers: ['vite', 'webpack']
  },
  {
    key: 'svelte',
    name: 'Svelte',
    displayName: 'Svelte',
    logo: 'svelte',
    category: 'ui-framework',
    boundlers: ['vite', 'webpack']
  },
  {
    key: 'angular',
    name: 'Angular',
    displayName: 'Angular',
    logo: 'angular',
    category: 'ui-framework',
    boundlers: ['vite', 'webpack']
  },
  {
    key: 'vanilla',
    name: 'Vanilla',
    displayName: 'Vanilla',
    logo: 'javascript',
    category: 'ui-framework',
    boundlers: ['vite', 'webpack', 'rollup', 'esbuild', 'rspack', 'farm', 'bun']
  },
];

export const defaultFramework: FrameworkKey = 'vue';

export function getFramework(key: FrameworkKey): Framework {
  return frameworks.find(f => f.key === key) || frameworks[0];
}

export function getFrameworksByCategory(category: Framework['category']): Framework[] {
  return frameworks.filter(f => f.category === category);
}

export interface Boundler {
  key: BoundlerKey;
  name: string;
  displayName: string;
  logo: string;
} 

export const boundlers: Boundler[] = [
  {
    key: 'vite',
    name: 'Vite',
    displayName: 'Vite',
    logo: 'vitejs'
  },
  {
    key: 'webpack',
    name: 'Webpack',
    displayName: 'Webpack',
    logo: 'webpack'
  },
  {
    key: 'rollup',
    name: 'Rollup',
    displayName: 'Rollup',
    logo: 'rollup'
  },
  {
    key: 'esbuild',
    name: 'esbuild',
    displayName: 'esbuild',
    logo: 'esbuild'
  },
  {
    key: 'rspack',
    name: 'rspack',
    displayName: 'rspack',
    logo: 'rspack'
  },
  {
    key: 'farm',
    name: 'Farm',
    displayName: 'Farm',
    logo: 'farm'
  },
  {
    key: 'astro',
    name: 'Astro',
    displayName: 'Astro',
    logo: 'astro'
  },
  {
    key: 'nuxt',
    name: 'Nuxt',
    displayName: 'Nuxt',
    logo: 'nuxt'
  },
  {
    key: 'vue-cli',
    name: 'Vue CLI',
    displayName: 'Vue CLI',
    logo: 'vue-cli'
  },
  {
    key: 'bun',
    name: 'Bun',
    displayName: 'Bun',
    logo: 'bun'
  },
  {
    key: 'next',
    name: 'Next.js',
    displayName: 'Next.js',
    logo: 'next'
  },
  {
    key: 'sveltekit',
    name: 'SvelteKit',
    displayName: 'SvelteKit',
    logo: 'sveltekit'
  }
];

export function getBoundler(key: BoundlerKey): Boundler {
  return boundlers.find(b => b.key === key) || boundlers[0];
}