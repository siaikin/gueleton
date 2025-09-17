// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import icon from "astro-icon";
import tailwindcss from '@tailwindcss/vite';
import Gueleton from 'unplugin-gueleton/vite'
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/": "/zh-cn/"
  },
  site: 'https://gueleton.siaikin.website',
  integrations: [starlight({
    title: 'Gueleton',
    components: {
      Hero: './src/components/overrides/Hero.astro',
      PageSidebar: './src/components/overrides/PageSidebar.astro',
      SiteTitle: './src/components/overrides/SiteTitle.astro',
    },
    social: [
      { icon: 'github', label: 'GitHub', href: 'https://github.com/siaikin/gueleton' },
      { icon: 'x.com', label: 'X', href: 'https://x.com/siaikin_' },
    ],
    head: [
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/dheereshag/coloured-icons@1.9.3/src/app/ci.min.css',
        },
      },
    ],
    sidebar: [
      {
        label: 'Getting Started',
        translations: {
          'zh-CN': '快速开始',
        },
        autogenerate: { directory: 'guides/getting-started' },
      },
      {
        label: 'Examples',
        translations: {
          'zh-CN': '示例',
        },
        autogenerate: { directory: 'examples' },
      },
    ],
    customCss: [
      // 你的 Tailwind 基础样式的相对路径
      './src/styles/global.css',
    ],
    defaultLocale: 'zh-cn',
    locales: {
      en: {
        label: 'English',
        lang: 'en'
      },
      'zh-cn': {
        label: '简体中文',
        lang: 'zh-CN',
      },
    },
    editLink: {
      baseUrl: 'https://github.com/siaikin/gueleton/edit/main/packages/docs/content/docs/',
    },
  }), icon(), vue({ appEntrypoint: '/src/lib/vue-app.ts' })],

  vite: {
    plugins: [Gueleton(), tailwindcss()],
  },
});