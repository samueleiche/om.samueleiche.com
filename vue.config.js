module.exports = {
	pwa: {
		name: 'om',
		assetsVersion: '1.1',
		themeColor: '#000000',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',
		iconPaths: {
			favicon32: 'favicon-32x32.png',
			favicon16: 'favicon-16x16.png',
			appleTouchIcon: 'apple-touch-icon.png',
			maskIcon: 'safari-pinned-tab.svg',
			msTileImage: 'mstile-150x150.png',
		},
		manifestOptions: {
			icons: [
				{ src: './android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
				{ src: './android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
				{
					src: './android-chrome-maskable-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: './android-chrome-maskable-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
			],
		},
	},
}
