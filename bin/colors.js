'use strict'

const jsome = require('jsome')
const chalk = require('chalk')

const pink = chalk.hex('#EA407B')

jsome.colors = {
  num: 'cyan',
  str: 'green',
  bool: 'red',
  regex: 'blue',
  undef: 'grey',
  null: 'grey',
  attr: 'reset',
  quot: 'gray',
  punc: 'gray',
  brack: 'gray'
}

module.exports = {
  jsome,
  pink,
  gray: chalk.gray,
  white: chalk.white
}
