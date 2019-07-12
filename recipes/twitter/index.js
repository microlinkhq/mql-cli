'use strict'

const byUsername = require('./by-username')
const bystatus = require('./by-status')

module.exports = async ({ query }) => {
  const { username, status } = query
  if (username) return byUsername(username)
  if (status) return bystatus(status)
}

module.exports.help = 'get data from Twitter profile/status.'

module.exports.flags = `
  --username        get Twitter info from an username. [required]
  --status          get Twitter info from an status URL. [required]
`
