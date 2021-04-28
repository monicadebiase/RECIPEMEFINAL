
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})

const express = require('express')

const router = express.Router()
const superagent = require('superagent')


router.get('/', (req, res, next) => {

	const data = req.context

	res.render('home', data)
})

router.get('/recipes', (req, res, next) => {

  const data = req.context

	res.render('recipes1', data)
})


router.get('/curation', function(req, res){


    var dish = req.query.q
    var diet = req.query.diet

    if (dish == null){
      res.json({
        confirmation: 'fail',
        message: 'Please enter a query paramter!'
      })
      return
    }


    const endpoint = 'https://api.edamam.com/search'
    const query = {
      q: dish,
      app_key: process.env.TURBO_APP_ID,
      app_id: '40eac79a'
    }

    superagent.get(endpoint)
    .query(query)
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
      data.hits.forEach((post, i) => {

        feed.push({
          label: post.recipe.label,
          image: post.recipe.image,
          url: post.recipe.url,
          yield: post.recipe.yield,
          ingr: post.recipe.ingredients
        })

      })


      res.render('recipes2', {feed: feed})
      return
    })


})

module.exports = router
