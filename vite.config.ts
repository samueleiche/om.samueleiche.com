import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteEjsPlugin } from 'vite-plugin-ejs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [
			ViteEjsPlugin((viteConfig) => {
				console.log(viteConfig.env)
				return {
					env: viteConfig.env,
				}
			}),
			vue(),
		],
		define: {
			'import.meta.env.APP_VERSION': JSON.stringify(env.npm_package_version),
		},
	}
})
