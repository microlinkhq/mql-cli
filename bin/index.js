#!/usr/bin/env node

'use strict'

const { cleanError, getError } = require('beauty-error')
const indentString = require('indent-string')
const existsFile = require('exists-file')
const clipboardy = require('clipboardy')
const sizeof = require('object-sizeof')
const timeSpan = require('time-span')
const chalk = require('chalk')
const path = require('path')

const print = require('./print')

const pkg = require('../package.json')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')({
  pkg,
  autoHelp: false,
  description: false,
  help: require('./help')
})

const exitOnError = rawError => {
  const { stack, message } = cleanError(getError(rawError))

  console.log()
  console.log(' ', print.label('error', 'red'), chalk.gray(message))

  if (stack) {
    let beautyStack = stack.split('\n')
    beautyStack.shift()
    beautyStack = beautyStack.map(line => chalk.gray(line))
    console.log(beautyStack.join('\n'))
  }

  process.exit(1)
}

const main = async () => {
  const [recipeName] = cli.input

  if (!recipeName) cli.showHelp()

  const filepath = path.resolve(__dirname, '../recipes', `${recipeName}.js`)

  if (!existsFile.sync(filepath)) {
    throw TypeError(`The recipe '${recipeName}' doesn't exist.`)
  }

  const fn = require(filepath)

  if (fn && cli.flags.help) {
    console.log(`\n${indentString(fn.help, 2)}`)
    console.log(`  \n  Flags${chalk.gray(indentString(fn.flags, 2))}`)
    process.exit()
  }

  const end = timeSpan()
  return [...(await fn({ query: cli.flags })), end()]
}

main()
  .then(([uri, data, time]) => {
    print.json(data)

    if (!cli.flags.quiet) {
      const sourceCodeUrl = print.link(
        `recipes/${cli.input[0]}`,
        `https://github.com/microlinkhq/mql-cli/blob/master/recipes/${
          cli.input[0]
        }.js`
      )

      const apiUrl = print.link('click to open', uri)

      console.log()
      console.log(
        ' ',
        print.label('success', 'green'),
        chalk.gray(`${print.bytes(sizeof(data))} in ${print.ms(time)}`)
      )
      console.log()

      console.log(print.keyValue(chalk.green('   code'), sourceCodeUrl))
      console.log(print.keyValue(chalk.green('    uri'), apiUrl))
    }

    if (cli.flags.copy) {
      clipboardy.writeSync(JSON.stringify(data, null, 2))
      console.log(`\n   ${chalk.gray('Copied to clipboard!')}`)
    }

    process.exit()
  })
  .catch(exitOnError)
