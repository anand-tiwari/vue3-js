import searchApi from '@src/api/search'

const state = {
  fetchData: false
}

const mutations = {
  TOGGLE_FETCHDATA: state => {
    state.fetchData = !state.fetchData
  }
}

const actions = {
  toggleFetchData ({ commit }) {
    commit('TOGGLE_FETCHDATA')
  },
  getProducts ({ commit }, { data, success, fail }) {
    searchApi.getCatalogProducts(
      response => {
        console.log('success ' + JSON.stringify(response))
      },
      data,
      response => {
        console.log('error' + JSON.stringify(response))
      }
    )
  }
}

const getters = {
  fetchData: state => state.fetchData
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
