const { defineConfig } = require('@vue/cli-service')

process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		server: 'https', // required for WakeLock, Notification
	},
	pwa: {
		// https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW
		workboxOptions: {
			runtimeCaching: [
				//https://developers.google.com/web/tools/workbox/guides/advanced-recipes?authuser=0#cached-av
				{
					urlPattern: /^https:\/\/assets.samueleiche.com/,
					// StaleWhileRevalidate can cause audio source errors sometimes for reasons unknown
					handler: 'NetworkFirst',
					options: {
						cacheName: 'audio',
					},
				},
				{
					urlPattern: /^https:\/\/fonts.googleapis.com/,
					handler: 'StaleWhileRevalidate',
					options: {
						cacheName: 'google-fonts-stylesheets',
					},
				},
				{
					urlPattern: /^https:\/\/fonts.gstatic.com/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'google-fonts-webfonts',
						cacheableResponse: {
							statuses: [0, 200],
						},
						expiration: {
							maxAgeSeconds: 60 * 60 * 24 * 365,
							maxEntries: 30,
						},
					},
				},
			],
		},
		name: 'om',
		assetsVersion: '2.0.1',
		themeColor: '#ffffff',
		msTileColor: '#ffffff',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',
		iconPaths: {
			faviconSVG: null,
			favicon32: 'img/icons/favicon-32x32.png',
			favicon16: 'img/icons/favicon-16x16.png',
			appleTouchIcon: 'img/icons/apple-touch-icon.png',
			maskIcon: 'img/icons/safari-pinned-tab.svg',
			msTileImage: 'img/icons/mstile-150x150.png',
		},
		manifestOptions: {
			icons: [
				{ src: './img/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
				{ src: './img/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
				{
					src: './img/icons/android-chrome-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: './img/icons/android-chrome-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
			],
			background_color: '#ffffff',
		},
	},
})
