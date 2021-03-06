'use strict'

const terminalLink = require('terminal-link')
const prettyBytes = require('pretty-bytes')
const prettyMs = require('pretty-ms')
const jsome = require('jsome')
const chalk = require('chalk')

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
  json: (payload, { color: colorize = true } = {}) =>
    colorize ? jsome(payload) : console.log(payload),

  label: (text, color) => chalk.inverse.bold[color](` ${text.toUpperCase()} `),

  bytes: prettyBytes,

  keyValue: (key, value) => {
    return value ? key + ' ' + chalk.gray(value) : undefined
  },

  ms: prettyMs,

  link: (text, url) => terminalLink(text, url, { fallback: () => url })
}
