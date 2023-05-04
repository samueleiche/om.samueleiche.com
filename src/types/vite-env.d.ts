/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
	readonly APP_VERSION: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
