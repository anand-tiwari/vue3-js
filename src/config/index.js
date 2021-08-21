module.exports = {
  api: {
    base_path: '',
    product: '/backend/search/products'
  },
  getApiPath: function (apiPath) {
    return this.api.base_path + apiPath
  }
}
