import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import order from './modules/order'
import cs from './../views/customerService/console/store'
// import control from './FinancialProductMag/control'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    errorLog,
    permission,
    tagsView,
    order,
    cs
  },
  getters
})

export default store
