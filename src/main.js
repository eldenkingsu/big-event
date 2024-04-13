import { createApp } from 'vue'

import '@/assets/main.scss'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
const app = createApp(App)
// console.log(gaga)
app.use(pinia)

app.use(router)

app.mount('#app')
