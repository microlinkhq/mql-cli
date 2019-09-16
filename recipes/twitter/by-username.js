'use strict'

const mql = require('@microlink/mql')
const { tweetRule, toTweets, toStats } = require('./util')

module.exports = async url => {
  const username = url.replace('https://twitter.com/', '')
  const { response, data } = await mql(url, {
    rules: {
      stats: {
        selector: '.ProfileNav-list',
        attr: {
          tweets: {
            type: 'number',
            selector: '.ProfileNav-item--tweets .ProfileNav-value',
            attr: 'data-count'
          },
          followings: {
            type: 'number',
            selector: '.ProfileNav-item--following .ProfileNav-value',
            attr: 'data-count'
          },
          followers: {
            type: 'number',
            selector: '.ProfileNav-item--followers .ProfileNav-value',
            attr: 'data-count'
          },
          favorites: {
            type: 'number',
            selector: '.ProfileNav-item--favorites .ProfileNav-value',
            attr: 'data-count'
          },
          moments: {
            type: 'number',
            selector: '.ProfileNav-item--moments .ProfileNav-value'
          },
          lists: {
            type: 'number',
            selector: '.ProfileNav-item--lists .ProfileNav-value'
          }
        }
      },
      website: {
        selector: '.ProfileHeaderCard-urlText > .u-textUserColor',
        attr: 'title',
        type: 'url'
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
      tweets: tweetRule
    }
  })

  const {
    website,
    stats,
    bio,
    name,
    avatar,
    image: background,
    tweets: allTweets
  } = data

  const user = {
    username,
    name,
    bio,
    avatar,
    background,
    website,
    stats: toStats(stats)
  }

  const [pinnedTweet, ...tweets] = toTweets(allTweets)

  return [
    response.url,
    {
      user,
      tweets,
      pinnedTweet
    }
  ]
}
