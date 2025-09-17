import { defineEcConfig } from 'astro-expressive-code'
import ecTwoSlash from "expressive-code-twoslash";
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default defineEcConfig({
  plugins: [
    ecTwoSlash(),
    pluginCollapsibleSections()
  ],
});
