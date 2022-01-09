module.exports = {
	pwa: {
		name: 'om',
		assetsVersion: '1.2',
		themeColor: '#000000',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',
		iconPaths: {
			favicon32: 'img/favicon-32x32.png',
			favicon16: 'img/favicon-16x16.png',
			appleTouchIcon: 'img/apple-touch-icon.png',
			maskIcon: 'img/safari-pinned-tab.svg',
			msTileImage: 'img/mstile-150x150.png',
		},
		manifestOptions: {
			icons: [
				{ src: './img/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
				{ src: './img/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
				{
					src: './img/android-chrome-maskable-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: './img/android-chrome-maskable-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
			],
		},
	},
}
