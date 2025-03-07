import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

const vueTsEslintConfig = defineConfigWithVueTs(pluginVue.configs['flat/essential'], vueTsConfigs.recommended)

export default [
	{ name: 'app/files-to-lint', files: ['**/*.{ts,mts,tsx,vue}'] },
	{ name: 'app/files-to-ignore', ignores: ['**/dist/**', '**/dev-dist/**', '**/dist-ssr/**', '**/coverage/**'] },
	...vueTsEslintConfig,
	skipFormatting,
	{
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/html-self-closing': 'off',
			'vue/require-default-prop': 'off',
			'vue/v-on-event-hyphenation': ['error', 'never'],
			'vue/attribute-hyphenation': ['error', 'never'],
			'vue/html-indent': ['error', 'tab'],
			indent: ['error', 'tab'],
		},
	},
]
