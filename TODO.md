- [x] 绝对定位元素的复制
- [x] 可控制是否更新数据，发起请求
- [x] data-gueleton-bone 标记 强制做为骨头
- [x] 无服务支持，在代码中预设预存数据，不需要打包工具支持
- [x] 预设样式，可自定义样式

- [x] 或许有一个预存数据管理面板会很有用？
- [] shimmer animation
- [] in-place 模式下，fuzzy 为 0 时, 将标签内部插入元素。但自闭合标签内部不允许存在子节点.
- [] 通过 proxy 记录被访问过的属性，以实现数据裁剪

## 用户安装其他依赖时，控制台会打印 ➜ Gueleton: http://localhost:3000/__gueleton/
```shell
siaikin@MacBook-Air natty-ui-v2 % npx nuxt@latest module add mdc
Need to install the following packages:
nuxt@4.0.3
Ok to proceed? (y) y

npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
ℹ Resolved @nuxtjs/mdc, adding module...                                                                                                                                                                          nuxi 12:39:59 AM
ℹ Installing @nuxtjs/mdc@0.17.2 as a dependency                                                                                                                                                                   nuxi 12:39:59 AM

added 150 packages, and audited 1463 packages in 31s

416 packages are looking for funding
run `npm fund` for details

found 0 vulnerabilities
ℹ Adding @nuxtjs/mdc to the modules                                                                                                                                                                               nuxi 12:40:30 AM
ℹ ➜ Gueleton: http://localhost:3000/__gueleton/                                                                                                                                                          nuxt-gueleton 12:40:33 AM
ℹ Nuxt Icon server bundle mode is set to local                                                                                                                                                                         12:40:33 AM
✔ Nuxt Icon discovered local-installed 2 collections: lucide, simple-icons                                                                                                                                             12:40:35 AM
✔ Types generated in .nuxt                      
```
