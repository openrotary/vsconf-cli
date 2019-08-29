#!/usr/bin/env node

const commander = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const logSymbols = require('log-symbols')
const shell = require('shelljs')
const chalk = require('chalk')
const configs = require('./configs')
const fs = require('fs')

commander.version('1.0.0')

commander.command('get <config>')
.description('获取配置文件')
.action(async (configName) => {
    const spinner = ora('正在下载配置文件...').start()
     // 下载对应的模板到本地
     const { downloadUrl } = configs[configName]
     download(downloadUrl, configName, { clone: true }, err => {
        if (err) {
            spinner.fail()
            console.log(logSymbols.error, '下载配置文件失败')
            return
          }
          // 下载成功
          spinner.succeed()
          console.log(chalk`👌🏻 {bold 初始化完成 !} ✨\n`)
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