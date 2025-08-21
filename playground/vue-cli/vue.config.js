const { defineConfig } = require('@vue/cli-service')
const GueletonPlugin = require('unplugin-gueleton/webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      GueletonPlugin.default({})
    ]
  }
})
