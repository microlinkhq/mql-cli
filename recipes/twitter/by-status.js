'use strict'

const mql = require('@microlink/mql')
const { toTweets, tweetRule } = require('./util')

module.exports = async url => {
  const { response, data } = await mql(url, {
    rules: {
      user: {
        selector: '.permalink-header',
        attr: {
          name: {
            selector: '.permalink-header .fullname'
          },
          username: {
            selector: '.permalink-header .username b'
          },
          avatar: {
            selector: 'img',
            type: 'image',
            attr: 'src'
          }
        }
      },
      tweets: tweetRule
    }
  })

  const { user, tweets: allTweets } = data
  const [tweet, ...replies] = toTweets(allTweets)
  return [response.url, { user, tweet, replies }]
}
