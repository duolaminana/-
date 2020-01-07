import { selectgetDictionaryBykeyApi } from '@/api/system'
const state = {
  quoteSku: null,
  paymentList: [],
  transportList: []
}

const mutations = {
  SET_QUOTE_SKU: (state, data) => {
    state.quoteSku = data
  },
  SET_PAYMENT_LIST: (state, data) => {
    state.paymentList = data
  },
  SET_TRANSPORT_LIST: (state, data) => {
    state.transportList = data
  }
}

const actions = {
  changeQuoteSku({ commit }, data) {
    commit('SET_QUOTE_SKU', data)
  },
  getPaymentList({ commit }, data) {
    selectgetDictionaryBykeyApi({ key: data }).then(res => {
      commit('SET_PAYMENT_LIST', res.data || [])
    })
  },
  getTransport({ commit }, data) {
    selectgetDictionaryBykeyApi({ key: data }).then(res => {
      commit('SET_TRANSPORT_LIST', res.data || [])
    })
  }
}

export default {
  state,
  mutations,
  actions
}

