import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Создаем приложение
const app = createApp(App)

// Подключаем Pinia
const pinia = createPinia()
app.use(pinia)

// Подключаем роутер
app.use(router)

// Монтируем Vue
app.mount('#app')
