import Vue from 'vue'
import App from './ReceiverApp.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
