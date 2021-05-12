
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})

const express = require('express')

const router = express.Router()
const superagent = require('superagent')



//copy paste line 13-18, 20-25 (remember to change '/' to allergies and 'home' to the name of the mustache file)
router.get('/', (req, res, next) => {

	const data = req.context

	res.render('home', data)
})

router.get('/ingredients', (req, res, next) => {

  const data = req.context

	res.render('ingredients', data)
})

router.get('/curation', function(req, res){

  function getKeyByValue(object, value) {
            let lst = []
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    if (object[prop] === value)
                    lst.push(prop);
                }
            }
            return lst
        }

  let catg = {
    veg : req.query.veg,
    fish : req.query.fish,
    cond : req.query.cond,
    dairy : req.query.dairy,
    beans : req.query.beans,
    fruit : req.query.fruit,
    wheat : req.query.wheat,
    dessert : req.query.dessert,
    meat : req.query.meat
    }

  // ans stores an array of the categories the user selected
  const ans = getKeyByValue(catg, "on");
  const dish = ans.join(" ")


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

    //API call executed
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



      json_data = response.body || response.text;
      //forEach = for every recipe (for loop)
      feed = []; 
      json_data.hits.forEach((post, i) => {

        feed.push({
          label: post.recipe.label,
          image: post.recipe.image,
          url: post.recipe.url,
          yield: post.recipe.yield,
          ingr: post.recipe.ingredients,
          index: i,
          totalWeight: post.recipe.totalWeight,
          totalNutrients: post.recipe.totalNutrients,
          totalDaily: post.recipe.totalDaily,
          dietLabels: post.recipe.dietLabels,
          healthLabels: post.recipe.healthLabels
        })

      })




      res.render('curation', {feed: feed})
      return
    })


})




// stuck here - have to find recipe based on the params sent. dont have access to variables declared for different routers

router.get('/recipe', (req, res, next) => {

/*  const i = req.query.hit

  let r = json_data.hits[i]

  let features = {
    label : r.label
  }*/
  // find recipe in data where x == data.recipe.label



/*    const endpoint = 'https://api.edamam.com/search'
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



      let json_data = response.body || response.text;

      let feed = [];
      json_data.hits.forEach((post, i) => {

        feed.push({
          label: post.recipe.label,
          image: post.recipe.image,
          url: post.recipe.url,
          yield: post.recipe.yield,
          ingr: post.recipe.ingredients
        })

      })




      res.render('recipe', {feed: feed})
      return
    })

*/
  const data = {
    label : req.query.label,
    image : req.query.image,
    url : req.query.url,
    yield : req.query.yield,
    calories : req.query.calories,
    totalWeight : req.query.totalWeight,
    ingr : req.query.ingr,
    totalNutrients : req.query.totalNutrients,
    totalDaily : req.query.totalDaily,
    dietLabels : req.query.dietLabels,
    healthLabels : req.query.healthLabels
    }

  res.render('recipe', data)

})

module.exports = router
