import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//bootstrap hacked in temporarily via index.html
import '@/assets/css/main.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

let app = createApp(App).use(router);
app.use(store);
app.use(VueSweetalert2);
app.mount('#app');

