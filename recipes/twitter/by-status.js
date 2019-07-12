'use strict'

const mql = require('@microlink/mql')
const { toNumber, mapValues } = require('lodash')

module.exports = async (status, opts) => {
  status = status.replace('https://twitter.com/', '')

  const { response, data } = await mql(`https://twitter.com/${status}`, {
    ...opts,
    rules: {
      author: {
        selector: '.permalink-header',
        attr: {
          username: {
            selector: '.permalink-header .fullname'
          },
          name: {
            selector: '.permalink-header .username b'
          },
          avatar: {
            selector: 'img',
            type: 'image',
            attr: 'src'
          }
        }
      },
      tweets: {
        selector: '.tweet:not([data-retweet-id])',
        attr: {
          stats: {
            selector: '.ProfileTweet-actionList',
            attr: {
              replies: {
                selector:
                  '.js-actionReply .ProfileTweet-actionCountForPresentation'
              },
              retweets: {
                selector:
                  '.js-actionRetweet .ProfileTweet-actionCountForPresentation'
              },
              likes: {
                selector:
                  '.js-actionFavorite .ProfileTweet-actionCountForPresentation'
              }
            }
          },
          timestamp: {
            selector: '.tweet-timestamp span',
            attr: 'data-time-ms'
          },
          text: {
            selector: '.tweet-text',
            attr: 'text'
          },
          tweetUrl: {
            selector: '.tweet-timestamp',
            attr: 'href'
          }
        }
      }
    }
  })

  const { author, tweets } = data

  const allTweets = tweets.map(tweet => {
    tweet.tweetUrl = `https://twitter.com/${tweet.tweetUrl}`
    tweet.stats = mapValues(tweet.stats, toNumber)
    return tweet
  })

  const [tweet, ...replies] = allTweets

  return [response.url, { author, tweet, replies }]
}
