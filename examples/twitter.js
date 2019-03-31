'use strict'

const mql = require('@microlink/mql')

module.exports = async ({ query }) => {
  const { username, force = false } = query

  if (!username) {
    throw new TypeError(`You need to pass 'username' as query parameter `)
  }

  const { data } = await mql(`https://twitter.com/${username}`, {
    force,
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
          }
        }
      },
      avatarUrl: {
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
        selector: 'ol > li',
        attr: {
          id: {
            selector: '.tweet-timestamp',
            attr: 'data-conversation-id',
            type: value => `https://twitter.com/${value}`
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

  const { stats, tweets, bio, name, avatarUrl } = data
  const [pinnedTweet, ...restTweets] = tweets
  return { pinnedTweet, tweets: restTweets, bio, name, avatarUrl, stats }
}

module.exports.help = 'Get the Twitter profile for any twitter username.'

module.exports.flags = `
  --username        Twitter username for fetching profile. [required]
`
