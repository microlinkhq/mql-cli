'use strict'

const { gray } = require('chalk')
const path = require('path')
const fs = require('fs')

const { description } = require('../package')

const recipesPath = path.resolve(__dirname, '../recipes')

const recipes = fs.readdirSync(recipesPath).map(name => {
  const example = require(`${recipesPath}/${name}`)
  return `  ${name.replace('.js', '')}    ${example.help}`
})

module.exports = `${description}.

Usage
  ${gray('$ mql <example> [flags]')}

Flags
  ${gray('--recipe            specify the recipe to run.')}
  ${gray('--copy              copy output to clipboard. [default=false]')}
  ${gray(
    "--quiet             don't show additional information. [default=false]"
  )}

Recipes
${gray(recipes)}
`
