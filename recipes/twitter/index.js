'use strict'

const byUsername = require('./by-username')
const bystatus = require('./by-status')

module.exports = async input => {
  const [url] = input
  const isTweet = url.includes('/status/')
  return (isTweet ? bystatus : byUsername)(url)
}

module.exports.help = 'Get data from a Twitter URL.'
