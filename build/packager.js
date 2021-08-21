const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const archiver = require('archiver')
const GROUP_ID = 'com.gdn.pyeongyang'

const projectDir = path.join(__dirname, '..')
const target = 'target'
const dist = 'dist'
const versionLabel = 'version'
const healthcheckLabel = 'healthcheck'
const targetDir = path.join(projectDir, target)

module.exports = {
  doPackage: function (mode) {
    const self = this

    mode = mode === 'RELEASE' ? '' : ('-' + mode)

    const targetFileName = process.env.npm_package_name + '-' + process.env.npm_package_version + mode + '.zip'
    const targetResourcesFileName = process.env.npm_package_name + '-resources-' + process.env.npm_package_version + mode + '.zip'

    const archFolder = path.join(GROUP_ID + '-' + process.env.npm_package_name, process.env.npm_package_version + mode)
    const archResourcesFolder = path.join(GROUP_ID + '-' + process.env.npm_package_name + '-resources', process.env.npm_package_version + mode)

    console.log('packaging...')
    console.log('projectDir: ' + projectDir)

    // Ensures that the directory exists. If the directory structure does not exist, it is created.
    fse.ensureDirSync(targetDir)

    console.log('copying dist to target...')
    // copy dist in sync mode. its like cp -r
    fse.copySync(path.join(projectDir, dist), targetDir)

    console.log('create additional files: version & health-check')
    // create additional files: version & health-check
    this.createAdditionalFiles(process.env.npm_package_version + mode, process.env.npm_package_name)

   console.log('archiving folder..')

    // create a file to stream archive data to.

    const output = fse.createWriteStream(path.join(targetDir, targetFileName))
    const outputResource = fse.createWriteStream(path.join(targetDir, targetResourcesFileName))

    // archive main zip

    // outputResource - search-ui-resources-1.0.0-1.zip its something like this.
    // after extract will structure like this - search-ui-resources/1.0.0-1
    this.archive(output, function (archive) {
      const files = ['index.html', 'manifest.json', 'service-worker.js', 'favicon.ico', 'robots.txt']
      const folders = []

      var precache = fse.readdirSync(path.join(projectDir, target))
      precacheFile = precache.filter(a=>a.match(/^(precache-manifest)\.(.+)\.js/))
      files.push(...precacheFile)

      // add index.html just inside version directory
      for (let i in files) {
        archive.file(path.join(projectDir, target, files[i]), {
          name: files[i],
          prefix: archFolder
        })
      }

      // now add a static directory inside version directory and add dist resources like js ,css inside that
      for (let i in folders) {
        archive.directory(path.join(projectDir, target, folders[i]), path.join( archFolder, folders[i]))
      }
      // add versionLabel just inside version directory
      archive.file(path.join(projectDir, target, versionLabel), {
        name: versionLabel,
        prefix: path.join( archFolder)
      })
      // add healthcheckLabel just inside version directory
      archive.file(path.join(projectDir, target, healthcheckLabel), {
        name: healthcheckLabel,
        prefix: path.join( archFolder)
      })
    }, function (archive) {
      const fileSize = (archive.pointer() / 1024)
      const fileSizeRound = Math.round(fileSize * 100) / 100
      console.log('Output file: ' + targetFileName + ' => ' + fileSizeRound + 'KBs')

      //create maven file
      self.createMaven(process.env.npm_package_version + mode, targetFileName, process.env.npm_package_name)

      // create resource archive
      self.archive(outputResource, function (archive) {
        archive.directory(path.join(projectDir, target, '/', 'static'),
          path.join( archResourcesFolder, '/', 'static'))
      }, function (archive) {
        const fileSize = (archive.pointer() / 1024)
        const fileSizeRound = Math.round(fileSize * 100) / 100
        console.log('Output file: ' + targetResourcesFileName + ' => ' + fileSizeRound + 'KBs')

        // clean up
        console.log('removing dummy data after zip creation')
        const files = ['index.html', 'manifest.json', 'service-worker.js', 'favicon.ico', 'robots.txt', 'static']

        var precache = fse.readdirSync(path.join(projectDir, target))
        precacheFile = precache.filter(a=>a.match(/^(precache-manifest)\.(.+)\.js/))
        files.push(...precacheFile)

        for (let i in files) {
            fse.removeSync(path.join(targetDir, files[i]))
        }
        fse.removeSync(path.join(targetDir, versionLabel))
        fse.removeSync(path.join(targetDir, healthcheckLabel))

        // create maven file
        console.log('creating pom-resources.xml')
        self.createMaven(process.env.npm_package_version + mode, targetResourcesFileName,
          process.env.npm_package_name + '-resources', 'pom-resources.xml')
      })
    })

  },
  /* Execution start from here and archiveAction & closeHandler is functional params to complete process */
  archive: function (output, archiveAction, closeHandler) {
    var archive = archiver('zip', {
      zlib: {level: 9} // Sets the compression level.
    });

    // listen for all archive data to be written
    output.on('close', () => closeHandler(archive));

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      throw err
    });

    // pipe archive data to the file
    archive.pipe(output)

    // to add static resource & index.html inside zip file
    archiveAction(archive)

    // to clear dummy data after zip creation
    archive.finalize()
  },
  // create maven package file
  createMaven: function (version, targetFileName, packageName, pomFile = 'pom.xml') {

    var output = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">\n' +
      '  <modelVersion>4.0.0</modelVersion>\n' +
      '  <groupId>' + GROUP_ID + '</groupId>\n' +
      '  <artifactId>' + packageName + '</artifactId>\n' +
      '  <packaging>pom</packaging>\n' +
      '  <version>' + version + '</version>\n' +
      '  <name>' + packageName + '</name>\n' +
      '  <properties>\n' +
      '    <file>target/'+targetFileName+'</file>\n' +
      '  </properties>\n' +
      '</project>\n'

    // write file
    fs.writeFileSync(pomFile, output)
  },

  createAdditionalFiles: function (version, packageName) {

    // health
    var healthString = '{"status":"UP"}'

    // version
    var versionString =
      'maven.groupId=' + GROUP_ID + '\n' +
      'maven.artifactId=' + packageName + '\n' +
      'maven.pom.version=' + version + '\n' +
      'maven.build.time=' + new Date().toISOString().replace('T',' ').substr(0,19)

    fse.writeFileSync(path.join(projectDir, target, healthcheckLabel), healthString)
    fse.writeFileSync(path.join(projectDir, target, versionLabel), versionString)
  }
}
