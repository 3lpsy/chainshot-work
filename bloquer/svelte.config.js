import path from 'path'
import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: [
    preprocess({
      defaults: {
        style: 'postcss'
      },
      postcss: true
    })
  ],

  kit: {
    adapter: adapter({
      fallback: 'app.html'
    }),
    target: '#svelte',
    vite: {
      resolve: {
        alias: {
          $stores: path.resolve('./src/stores'),
          $services: path.resolve('./src/services'),
          $utils: path.resolve('./src/utils'),
          $components: path.resolve('./src/components'),
          $pages: path.resolve('./src/pages'),
          $classes: path.resolve('./src/classes')
        }
      }
    }
  }
}
