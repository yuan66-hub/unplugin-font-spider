import { createApp } from 'vue'
import App from './src/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import page1 from './src/views/page1.vue'
import page2 from './src/views/page2.vue'

const app = createApp(App)
const routes = [{
    path: '/page1',
    component: page1
}, {
    path: '/page2',
    component: page2
}]

const router = createRouter({
    routes: routes,
    history: createWebHistory()
})
app.use(router).mount('#app')



