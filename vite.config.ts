import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		server: {
			https: true,
		},
		plugins: [
			mkcert(),
			ViteEjsPlugin((viteConfig) => {
				return {
					env: viteConfig.env,
				}
			}),
			// https://vite-pwa-org.netlify.app/guide/development.html#development
			// https://vite-pwa-org.netlify.app/frameworks/vue.html
			VitePWA({
				devOptions: {
					enabled: true,
				},
				manifest: {
					name: 'Om',
					description: 'A helpful app that reminds you to stay mindful',
					theme_color: '#ffffff',
					background_color: '#ffffff',
					icons: [
						{ src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
						{ src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
					],
				},
				workbox: {
					globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
					runtimeCaching: [
						{
							urlPattern: /^https:\/\/assets\.samueleiche\.com\/.*/i,
							handler: 'NetworkFirst',
							options: {
								cacheName: 'audio',
							},
						},
						{
							urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'google-fonts-cache',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
						{
							urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'gstatic-fonts-cache',
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
					],
				},
			}),
			vue(),
		],
	}
})
