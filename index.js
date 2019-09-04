#!/usr/bin/env node

const commander = require('commander')
const download = require('download-git-repo')
const ora = require('ora')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const configs = require('./configs')
const { getFiles, deleteIt, copy } = require('./utils')

commander.version('1.0.0')

commander
  .command('get <config>')
  .description('检查并获取配置文件')
  .action(async configName => {
    const files = getFiles(`./`)
    if (!files.includes('package.json')) {
      console.log(
        logSymbols.error,
        '该路径下没有package.json文件，请先将其工程化'
      )
      return
    }
    // 是否将原有的配置文件直接删除？
    const fileList = [
      '.eslintignore',
      '.eslintrc.json',
      '.prettierrc',
      '.vscode',
      'postcss.config.js'
    ]
    fileList.forEach(file => {
      files.includes(file) && deleteIt(`./${file}`)
    })
    const spinner = ora().start()
    console.log(chalk`✨正在下载配置文件\n`)
    if (!Object.keys(configs).includes(configName)) {
      // 输入的模板名不包含在配置列表内
      spinner.fail('不存在的模板名')
      return
    }
    // 下载对应的模板到本地
    const { downloadUrl } = configs[configName]
    download(downloadUrl, configName, { clone: true }, err => {
      if (err) {
        console.log(logSymbols.error, '下载配置文件失败')
        spinner.fail(err)
        return
      }
      console.log(chalk`✨正在替换文件\n`)
      const configList = getFiles(`./${configName}`).filter(file =>
        fileList.includes(file)
      )
      configList.forEach(file => {
        copy(`./${configName}/${file}`, `./${file}`)
      })
      console.log(chalk`✨正在清理文件\n`)
      deleteIt(`./${configName}`)
      // 完成
      spinner.succeed(chalk`👌🏻 {bold 初始化完成 !} ✨\n`)
    })
  })

commander
  .command('ls')
  .description('查看配置列表')
  .action(() => {
    for (let key in configs) {
      console.log(`⭐️ ${key} - ${configs[key].description}`)
    }
  })

// 用于解析命令行参数
commander.parse(process.argv)
