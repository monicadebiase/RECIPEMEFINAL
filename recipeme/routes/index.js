// Full Documentation - https://docs.turbo360.co
const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { text: 'This is the dynamic data. Open index.js from the routes directory to see.' })
})

router.get('/fetch', (req, res) => {
  res.render('fetch')
})

router.get('/xhr', (req, res) => {
  res.render('xhr')
})

router.get('/ajax', (req, res) => {
  res.render('ajax')
})

router.get('/axios/:sub', async (req, res) => {
  try {
    const payload = await axios({
      url: `https://www.reddit.com/r/${req.params.sub}.json`,
      method: 'get',
      headers: { Accept: 'application/json' }
    })

    // parse out desired data from the response:
    const response = payload.data
    const { data } = response
    const { children } = data

    res.render('axios', { feed: children, sub: req.params.sub })
  } catch (error) {
    res.send(`ERROR. Something went wrong: ${error.message}`)
  }
})

module.exports = router
