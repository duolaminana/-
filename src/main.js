import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // internationalization
import '@/icons' // icon
import '@/permission' // permission control
// import './utils/error-log' // error log
import * as filters from './filters' // global filters
import { getToken } from '@/utils/auth'
import { downloadFile } from '@/api/common'

// set ElementUI lang to EN
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const mixin = {
  data() {
    return {
      uploadFileHttp: 'http://sgi-oss-2.oss-ap-southeast-1.aliyuncs.com/',
      upLoadHeaders: {
        token: getToken()
      }
    }
  },
  computed: {
    language () {
      return store.state.app.language
    },
    isZh () {
      return this.language === 'zh'
    }
  },
  methods: {
    downFile(url) {
      if (url) {
        let fullUrl = /(http|https):\/\/([\w.]+\/?)\S*/.test(url) ? url : this.uploadFileHttp + url;
        window.open(downloadFile + '?fileUrl=' + fullUrl + '&token=' + getToken())
      }
    },
    fullUrl(url) {
      let fullUrl = '';
      if (url) {
        fullUrl = /(http|https):\/\/([\w.]+\/?)\S*/.test(url) ? url : this.uploadFileHttp + url
      }
      return fullUrl
    }
  }
};
Vue.mixin(mixin);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
