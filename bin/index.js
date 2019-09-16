#!/usr/bin/env node

'use strict'

const { cleanError, getError } = require('beauty-error')
const clipboardy = require('clipboardy')
const sizeof = require('object-sizeof')
const timeSpan = require('time-span')
const chalk = require('chalk')

const pkg = require('../package.json')
const print = require('./print')
const help = require('./help')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')({
  pkg,
  autoHelp: false,
  description: false,
  help: help()
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
  const { recipe: recipeName } = cli.flags

  if (!recipeName) cli.showHelp()

  let fn
  try {
    fn = require(`../recipes/${recipeName}`)
  } catch (err) {
    throw TypeError(`The recipe '${recipeName}' doesn't exist.`)
  }

  if (fn && cli.flags.help) {
    console.log(help.recipe(fn, cli.flags))
    process.exit()
  }

  const end = timeSpan()
  return [...(await fn(cli.input, cli.flags)), end()]
}

main()
  .then(([uri, data, time]) => {
    print.json(data)

    if (!cli.flags.quiet) {
      const sourceCodeUrl = print.link(
        `recipes/${cli.flags.recipe}`,
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
