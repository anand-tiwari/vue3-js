const chalk = require('chalk')
const config = require('./config.js')
const env = process.argv.slice(3)
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = config[env].port | process.env.VUE_APP_PORT
const publicPath = config[env].publicPath

var connect = require('connect')
var serveStatic = require('serve-static')
const app = connect()

app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/']
    })
)

// app.use('/api', createProxyMiddleware({ target: 'http://www.example.org', changeOrigin: true }));
for (var i in config.staging.proxyTable) {
    app.use(i, createProxyMiddleware(config.staging.proxyTable[i]))
}

app.listen(port, function () {
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))
})
