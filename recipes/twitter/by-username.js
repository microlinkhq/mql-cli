'use strict'

const mql = require('@microlink/mql')
const { toNumber, mapValues } = require('lodash')

module.exports = async username => {
  if (username.startsWith('@')) username = username.substring(1)

  const { response, data } = await mql(`https://twitter.com/${username}`, {
    rules: {
      stats: {
        selector: '.ProfileNav-list',
        attr: {
          tweets: {
            selector: '.ProfileNav-item--tweets .ProfileNav-value',
            attr: 'data-count'
          },
          followings: {
            selector: '.ProfileNav-item--following .ProfileNav-value',
            attr: 'data-count'
          },
          favorites: {
            selector: '.ProfileNav-item--favorites .ProfileNav-value',
            attr: 'data-count'
          },
          moments: {
            selector: '.ProfileNav-item--moments .ProfileNav-value',
            attr: 'text'
          },
          lists: {
            selector: '.ProfileNav-item--lists .ProfileNav-value',
            attr: 'text'
          }
        }
      },
      website: {
        selector: '.ProfileHeaderCard-urlText > .u-textUserColor',
        attr: 'title'
      },
      avatar: {
        type: 'image',
        selector: '.ProfileAvatar-image',
        attr: 'src'
      },
      bio: {
        selector: '.ProfileHeaderCard-bio',
        attr: 'text'
      },
      name: {
        selector: '.ProfileHeaderCard-nameLink',
        attr: 'text'
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

  const { website, stats, bio, name, avatar, image: background, tweets } = data

  const author = {
    username,
    name,
    bio,
    avatar,
    background,
    website,
    stats
  }

  const allTweets = tweets.map(tweet => {
    tweet.tweetUrl = `https://twitter.com/${tweet.tweetUrl}`
    tweet.stats = mapValues(tweet.stats, toNumber)
    return tweet
  })

  const [pinnedTweet, ...restTweets] = allTweets

  return [
    response.url,
    {
      author,
      pinnedTweet,
      tweets: restTweets
    }
  ]
}