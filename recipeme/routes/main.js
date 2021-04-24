
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})

const express = require('express')

const router = express.Router()
const superagent = require('superagent')


router.get('/', (req, res, next) => {

	const data = req.context

	res.render('home', data)
})

router.get('/curation', (req, res, next) => {

  const data = req.context

	res.render('blog', data)
})

router.get('/recipes', (req, res, next) => {

  var dish = req.query.q
  var diet = req.query.diet

  //if (dish == null){
  //  res.json({
  //    confirmation: 'fail',
  //    message: 'Please enter a query paramter!'
  //  })
  //  return
  //}


  const endpoint = 'https://api.edamam.com/search'
  const query = {
    q: dish,
    app_key: process.env.TURBO_APP_ID,
    app_id: '40eac79a'
  }

  superagent.get(url)
  .query(null)
  .set('Accept', 'application/json')
  .end((err, response) => {
    if (err){
      res.json({
        confirmation: 'fail',
        message: err.message
      })
      return
    }

    const data = response.body || response.text

    let feed = []
    data.user.media.nodes.forEach((post, i) => {
      feed.push({
        image: post.thumbnail_src,
        caption: post.caption
      })
    })

    res.render('recipes', {feed: feed})
    //return
  })
})

module.exports = router
