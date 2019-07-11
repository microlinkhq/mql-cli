'use strict'

const path = require('path')
const fs = require('fs')

const { gray } = require('./colors')
const { description } = require('../package')

const examplesPath = path.resolve(__dirname, '../examples')

const examples = fs.readdirSync(examplesPath).map(name => {
  const example = require(`${examplesPath}/${name}`)
  return `  ${name.replace('.js', '')}         ${example.help}`
})

module.exports = `${description}.

Usage
  ${gray('$ mql <example>[flags]')}

Flags
  ${gray('--copy          copy output to clipboard. [default=false]')}
  ${gray("--quiet         don't show additional information. [default=false]")}

Recipes
${gray(examples)}
`
