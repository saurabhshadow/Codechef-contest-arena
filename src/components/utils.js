const fetch = require('node-fetch')

var config = require(`../config-dev.json`)
const url = config.urlBase

module.exports = {
  config: config,

  getTokenFirstTime: function (code, cb) {
    const tokenURL = url + config.urlToken
    const data = {
      'grant_type': 'authorization_code',
      'code': code,
      'client_id': config.clientID,
      'client_secret': config.clientSecret,
      'redirect_uri': config.urlRedirect
    }

    fetch(tokenURL, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      .then(res => res.json())
      .then(res => {
        if (res.status !== 'OK') return cb(res.result)
        const tokens = res.result.data

        cb(null,tokens)

      })
      .catch(err => console.log('Can not get the token from codechef', err))
  },

  refreshToken: function () {

    const tokenURL = url + config.urlToken
    const data = {
      'grant_type': 'refresh_token',
      'refresh_token': window.localStorage.refresh_token,
      'client_id': config.clientID,
      'client_secret': config.clientSecret
    }

    fetch(tokenURL, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      .then(res => res.json())
      .then(res => {
        if ('status' in res && res.status === 'OK') {
          var data = res.result.data
          window.localStorage.setItem('access_token', data.access_token)
          window.localStorage.setItem('refresh_token', data.refresh_token)
          window.localStorage.setItem('expires_in',Date.now()+data.expires_in*1000)
        }
      })
      .catch(err => {
        console.log('Can not refresh token', err)
        module.exports.logout()
      })
  },

  getSecureRequest: function (url, token, next) {
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(res => {
        if (('status' in res) && (res.status === 'OK')) {
          if ('content' in res.result.data) {
            next(null, res.result.data.content)
          } else {
            next(res.result.data.message)
          }
        } else {
          next(res)
        }
      })
      .catch(err => {
        console.log('Can not perform secure request', err)
        next(err)
      })
  },

  getRequest: function (url, next) {
    // TODO: Fix credentials, only share with the backend
    fetch(url, { credentials: 'include' })
      .then(res => res.json())
      .then(res => next(null, res))
      .catch(err => next(err))
  },

  postRequest: function (url, data, next) {
    // TODO: Fix credentials, only share with the backend
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }).then(res => res.json())
      .then(res => next(null, res))
      .catch(err => next(err))
  },

  checkLocalStorage: function (cb) {
    function check () {
      var test = 'test'
      try {
        window.localStorage.setItem(test, test)
        window.localStorage.removeItem(test)
        cb()
      } catch (e) {
        cb(e)
      }
    }
    check()
  },

  moveTo: function (to) {
    window.location = to
  },

  logout: function () {
    module.exports.clearSession()
    module.exports.moveTo('/')
  },

  isLogged: function () {
    const token = window.localStorage.getItem('access_token')
    if (token && token !== '') return true
    return false
  },

  clearCookies () {
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c.replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
  },

  clearSession () {
    window.localStorage.clear()
    module.exports.clearCookies()

  }
}
