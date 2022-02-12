import { createApp } from 'vue'
import { registerServiceWorker } from './support/serviceWorker'
import { createOverlayMount } from './composables/global/useOverlay'

import App from './App.vue'

registerServiceWorker()

const app = createApp(App)

createOverlayMount()

app.mount('#app')
