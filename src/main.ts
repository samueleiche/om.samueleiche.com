import { createApp } from 'vue'
import { registerServiceWorker } from './support/serviceWorker'
import App from './App.vue'

registerServiceWorker()

const app = createApp(App)

app.mount('#app')
