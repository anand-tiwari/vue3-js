import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

if (process.env.VUE_APP_MOCK_ENV !== 'false') {
  console.log(
    'Starting mock... !!  VUE_APP_MOCK_ENV = ' + process.env.VUE_APP_MOCK_ENV
  )
  require('@api-mock/index.js')
}

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
