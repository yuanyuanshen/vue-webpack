import Vue from 'vue'
import App from './app.vue'
import './assets/css/global.css'

// const root = document.createElement('div')
// document.body.appendChild(root)

// new Vue({
//   render: h => h(App) //h就是vue中的createApp参数
// }).$mount('#app') //将app挂载到body下的div上

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
