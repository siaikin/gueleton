const { defineConfig } = require('@vue/cli-service')
const { Gueleton } = require('unplugin-gueleton/webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      Gueleton()
    ]
  }
})
