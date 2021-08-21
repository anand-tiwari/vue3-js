module.exports.serializeQueryParams = function (paramObj) {
  if (paramObj) {
    return (
      '?' +
      Object.keys(paramObj)
        .map(k => {
          if (typeof paramObj[k] === 'object') {
            return paramObj[k]
              .map(v => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
              .join('&')
          } else {
            return `${encodeURIComponent(k)}=${encodeURIComponent(
              paramObj[k]
            )}`
          }
        })
        .join('&')
    )
  }
  return ''
}
