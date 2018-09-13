// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import axios from "axios";
import { loadProgressBar } from 'axios-progress-bar';
import Vuelidate from "vuelidate";
import VueNotifications from "vue-notifications";
import miniToastr from "mini-toastr";
import VueCroppa from "vue-croppa";
import { Datetime } from "vue-datetime";
import { VueEditor } from "vue2-editor";

// todo
// cssVars()
const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn'
}

miniToastr.init({types: toastTypes})

function toast ({title, message, type, timeout, cb}) {
  return miniToastr[type](message, title, timeout, cb)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

VueNotifications.config.timeout = 4000
Vue.use(VueNotifications, options)
Vue.use(Vuelidate)
Vue.use(loadProgressBar)
Vue.use(VueCroppa);
Vue.use(BootstrapVue)
Vue.component('datetime', Datetime);
Vue.component('vue-editor', VueEditor);

Vue.prototype.$http = axios
Vue.prototype.$notify = VueNotifications

Vue.prototype.SIZE = 20;
Vue.prototype.API_ENDPOINT = ''

router.beforeEach((to, from, next) => {
  axios.get(Vue.prototype.API_ENDPOINT+'/admin/auth/checklogin').then(res => {
    if(res.data===null){
      if(to.path!=='/login'){
        next('/login')
        // return
      }
      next()
    }else{
      window.sessionStorage.setItem('user', JSON.stringify(res.data.user));
      next()
    }
  }).catch(err => console.log(err.response))
})

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if(error.response.status===401 && window.location.hash!=='#/login'){
    window.location.href = '/'
  }
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
