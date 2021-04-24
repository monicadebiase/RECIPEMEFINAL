
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})

const express = require('express')
const axios = require('axios')

const router = express.Router()
const superagent = require('superagent')


router.get('/', (req, res, next) => {

	const data = req.context

	res.render('home', data)
})

router.get('/blog', (req, res, next) => {

  const data = req.context

	res.render('blog', data)
})


router.get('/:page', function(req, res){
  var page = req.params.page

//  if (page == 'foursquare'){
//    if (req.query.query == null){
//      res.json({
//        confirmation: 'fail',
//    message: 'Missing query paramter'
//    })
//      return
//    }

    // http://localhost:3000/foursquare?near=chicago&query=bagels

  //const selectedFile = document.getElementById('input').value

  if (page == 'fetch'){
    res.render('fetch')
  }

  if (page == 'ajax'){
    res.render('ajax')
  }


  if (page == 'edamam'){


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


      res.render('edamam', {feed: feed})
      return
    })
  }

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
