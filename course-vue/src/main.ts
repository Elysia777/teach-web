import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ArcoVue from '@arco-design/web-vue';

import '@arco-design/web-vue/dist/arco.css';
import '@/styles/index.scss'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import router from './router'


const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPersistedstate);
app.use(pinia)
app.use(ArcoVue)
app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(VueCookies)


app.mount('#app')