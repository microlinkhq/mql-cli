'use strict'

const { mapValues, toNumber } = require('lodash')

const toStats = stats => mapValues(stats, toNumber)

const toTweets = tweets =>
  tweets.map(tweet => {
    tweet.tweetUrl = `https://twitter.com/${tweet.tweetUrl}`
    tweet.stats = toStats(tweet.stats)
    return tweet
  })

const tweetRule = {
  selector: '.tweet:not([data-retweet-id])',
  attr: {
    stats: {
      selector: '.ProfileTweet-actionList',
      attr: {
        replies: {
          type: 'number',
          selector: '.js-actionReply .ProfileTweet-actionCountForPresentation'
        },
        retweets: {
          type: 'number',
          selector:
            '.js-actionRetweet .ProfileTweet-actionCountForPresentation'
        },
        likes: {
          type: 'number',
          selector:
            '.js-actionFavorite .ProfileTweet-actionCountForPresentation'
        }
      }
    },
    timestamp: {
      type: 'number',
      selector: '.tweet-timestamp span',
      attr: 'data-time-ms'
    },
    text: {
      selector: '.tweet-text',
      attr: 'text'
    },
    tweetUrl: {
      type: 'url',
      selector: '.tweet-timestamp',
      attr: 'href'
    }
  }
}

module.exports = {
  tweetRule,
  toTweets,
  toStats
}
