const fs = require('fs')
const path = require('path')

const getFiles = path => {
  return fs.readdirSync(path)
}

const _deleteFile = path => {
  fs.unlinkSync(path)
}

const _deleteDir = path => {
  var files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function(file, index) {
      var curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        _deleteDir(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

const deleteIt = path => {
  if (fs.statSync(path).isDirectory()) {
    _deleteDir(path)
    return
  }
  _deleteFile(path)
}

const copy = (from, to) => {
  if (!fs.statSync(from).isDirectory()) {
    // 文件
    const file = fs.readFileSync(from, 'utf8')
    fs.writeFileSync(to, file)
    return
  }
  fs.mkdirSync(to)
  const fileList = getFiles(from)
  fileList.forEach(file => {
    const _file = fs.readFileSync(`${from}/${file}`, 'utf8')
    fs.writeFileSync(`${to}/${file}`, _file)
  })
}

module.exports = {
  getFiles,
  deleteIt,
  copy
}
