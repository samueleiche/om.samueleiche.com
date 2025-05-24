export default {
	'src/**/*.{js,ts,vue,json,scss}': ['npm run prettier', 'npm run lint'],
	'src/**/*.{ts,vue}': () => 'npm run type-check',
	'*.html': 'npm run prettier',
}
