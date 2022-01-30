import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { createOverlayMount } from './composables/global/useOverlay'

const app = createApp(App)

createOverlayMount()

app.mount('#app')
