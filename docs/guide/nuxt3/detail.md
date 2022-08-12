
- Nuxt 会自动导入您`components/`目录中的任何组件（以及您可能正在使用的任何模块注册的组件）。

- nux3 jsx自动支持

- nuxt3 使用jsx的话components下的组件不引入的话渲染不出来(需要配置**nuxt.config.ts中的components选项**开启全局注册组件)，按需导入的element-ui组件可以直接使用 (jsx问题)


## nuxt3集成插件

- nuxt3 element-plus自动导入

  ```js
  pnpm i  @daotl/unplugin-vue-components unplugin-auto-import unplugin-vue-components -D
  ```

  在nuxt.config.ts引入

  ```js
  import { ElementPlusResolver } from '@daotl/unplugin-vue-components/resolvers'
  
  const lifecycle = process.env.npm_lifecycle_event
  
  const autoImportOpts = {
    // global imports to register
    imports: [
      'pinia',
      {},
    ],
    resolvers: [ElementPlusResolver({ nuxt: true, ssr: true })],
    dts: './auto-imports.d.ts',
  }
  const vueComponentsOpts = {
    resolvers: [ElementPlusResolver({ nuxt: true, ssr: true })],
    dts: './vue-components.d.ts',
  }
  
  export default defineNuxtConfig({
      modules: [
          ['unplugin-auto-import/nuxt', autoImportOpts],
          ['unplugin-vue-components/nuxt', vueComponentsOpts],
      ],
      css: ["element-plus/theme-chalk/index.css"],
      build: {
        transpile: [
            ...(lifecycle === 'build' || lifecycle === 'generate'
              ? ['element-plus']
              : []),
            // 'element-plus/es',
         ]
      }
  })
  
  ```



- nuxt3使用lodash

  安装nuxt-lodash

  ```
  pnpm install nuxt-lodash -D
  ```

  配置nuxt.config.ts

  ```
  // nuxt.config.ts
  export default {
    modules: [
     "nuxt-lodash"
    ],
  }
  ```



- nuxt3集成pinia

  ```
  pnpm install pinia @pinia/nuxt
  ```

  配置nuxt.config.ts

  ```
  // nuxt.config.ts
  export default {
    modules: [
     "@pinia/nuxt"
    ],
  }
  ```

  

- nuxt3集成vueuse

  ```
  pnpm install -D @vueuse/nuxt @vueuse/core
  ```

  ```
  // nuxt.config.ts
  export default {
    modules: [
      '@vueuse/nuxt',
    ],
  }
  ```



- nuxt3 集成svgicon

  ```
  pnpm install nuxt-icons
  ```

  ```
  import { defineNuxtConfig } from 'nuxt3'
  export default defineNuxtConfig({
      modules: [
          'nuxt-icons'
        ]
  })
  ```

  参考https://github.com/gitFoxCode/nuxt-icons