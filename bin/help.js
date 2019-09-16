'use strict'

const { gray } = require('chalk')
const path = require('path')
const fs = require('fs')

const { description } = require('../package')

const recipesPath = path.resolve(__dirname, '../recipes')

const recipes = fs
  .readdirSync(recipesPath)
  .map(name => {
    const example = require(`${recipesPath}/${name}`)
    return `  ${name.replace('.js', '')}\t${example.help}`
  })
  .join('\n')

module.exports = () => `${description}.

Usage
  ${gray('$ mql <flags>')}

Flags
  ${gray('--recipe\tspecify the recipe to run.')}
  ${gray('--copy\tcopy output to clipboard. [default=false]')}
  ${gray("--quiet\tdon't show additional information. [default=false]")}

Recipes
${gray(recipes)}
`

module.exports.recipe = (fn, { recipe: recipeName }) => `
  ${fn.help}

  Usage
    ${gray(`$ mql --recipe ${recipeName} <url>`)}
`
