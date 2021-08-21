const fsExtra = require('fs-extra')
const path = require('path')
const replace = require('replace-in-file')
const chalk = require('chalk')

const projectDir = path.join(__dirname, '..')

const arg2 = process.argv[2] || ''

const MODE = arg2.toUpperCase()

const APP_VERSION = process.env.npm_package_version + (MODE === 'SNAPSHOT' ? '-' + MODE : '')

console.log(APP_VERSION, 'APP_VERSION')

const dockerFiles = [
    'Dockerfile',
    'docker_build.properties'
]

dockerFiles.forEach(i => {

    const sourceFile = path.join(projectDir, 'docker', i + '.default')
    const targetFile = path.join(projectDir, i)

    console.log(chalk.cyan('Preparing ' + i + ' file..'))

    fsExtra.copySync(sourceFile, targetFile)

    const replaceOpts = {
        files: targetFile,
        from: new RegExp('{{APP_VERSION}}', 'g'),
        to: APP_VERSION
    }
    replace.sync(replaceOpts)

    console.log(chalk.green('File ' + i + ' ready.'))
})