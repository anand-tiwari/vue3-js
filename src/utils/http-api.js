import axios from 'axios'
import config from '@/config'

axios.interceptors.response.use(
  // do nothing
  res => res,
  defaultErrorHandler
)

const SYSTEM_BUSY_CODES = [429, 503]
export function defaultErrorHandler (error) {
  const response = error.response
  // handle busy
  if (SYSTEM_BUSY_CODES.indexOf(response.status) > -1) {
    console.log('api response error = ' + response)
  }
  return Promise.reject(error)
}

export default {
  getDataViaApi (path, cb, errorHandler, headerParams = {}) {
    const headerObject = { 'Cache-Control': 'no-cache' }
    axios
      .get(config.getApiPath(path), {
        headers: { ...headerObject, ...headerParams }
      })
      .then(cb)
      .catch(errorHandler)
  },

  postDataViaApi (path, cb, data, errorHandler, headerParams = {}) {
    const headerObject = {}
    axios
      .post(config.getApiPath(path), data, {
        headers: { ...headerObject, ...headerParams }
      })
      .then(cb)
      .catch(errorHandler)
  },

  deleteDataViaApi (path, cb, errorHandler) {
    axios
      .delete(config.getApiPath(path))
      .then(cb)
      .catch(errorHandler)
  },

  putDataViaApi (path, cb, data, errorHandler) {
    axios
      .put(config.getApiPath(path), data)
      .then(cb)
      .catch(errorHandler)
  },
  defaultErrorHandler
}
