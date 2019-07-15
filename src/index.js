import Vue from 'vue'
import App from './app.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.scss'
import Backend from 'vue_backend'

// const root = document.createElement('div')
// document.body.appendChild(root)

// new Vue({
//   render: h => h(App) //h就是vue中的createApp参数
// }).$mount('#app') //将app挂载到body下的div上

Vue.use(ElementUI)
Vue.use(Backend)

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
