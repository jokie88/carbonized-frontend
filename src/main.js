import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//bootstrap hacked in temporarily via index.html
import '@/assets/css/main.css'




let app = createApp(App).use(router)
app.use(store)
app.mount('#app')

