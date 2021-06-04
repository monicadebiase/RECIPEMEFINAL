
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})

const express = require('express')

const router = express.Router()
const superagent = require('superagent')

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

//copy paste line 13-18, 20-25 (remember to change '/' to allergies and 'home' to the name of the mustache file)
router.get('/', (req, res, next) => {

	const data = req.context

	res.render('home', data)
})

router.get('/mealtype', (req, res, next) => {

	const data = req.context

	res.render('mealtype')
})

router.get('/ingredients', (req, res, next) => {

  let catg = {
    Breakfast : req.query.breakfast,
    Lunch : req.query.lunch,
    Dinner : req.query.dinner,
    Snack : req.query.snack,
    Teamtime : req.query.teatime,
    }

  let meal = getKeyByValue(catg, "on");
  meal = meal.join(" ")

  if (meal == null){
    res.json({
      confirmation: 'fail',
      message: 'Please enter a query paramter!'
    })
    return
  }

	res.render('ingredients', {meal: meal})
})

router.get('/allergies', (req, res, next) => {


  let catg = {
    vegetables : req.query.veg,
    fish : req.query.fish,
    condiments : req.query.cond,
    dairy : req.query.dairy,
    beans : req.query.beans,
    fruit : req.query.fruit,
    wheat : req.query.wheat,
    dessert : req.query.dessert,
    meat : req.query.meat
    }

  let ingr = getKeyByValue(catg, "on");
  ingr = ingr.join(" ")

  const data = {
    meal : req.query.mealtype,
    ingr : ingr
  }

  res.render('allergies', data)
})

router.get('/curation', (req, res) => {

  const meal = req.query.mealtype
  const ingr = req.query.ingr

  let catg = {
    "tree-nut-free" : req.query.nonuts,
    "peanut-free" : req.query.nonuts,
    "gluten-free" : req.query.nogluten,
    "low-sugar" : req.query.nosugar,
    "egg-free" : req.query.noeggs,
    "dairy-free" : req.query.nodairy,
    "shellfish-free" : req.query.noshellfish,
    "vegetarian" : req.query.vegetarian,
    "vegan" : req.query.vegan
    }

  // ans stores an array of the categories the user selected
  const ans = getKeyByValue(catg, "on");
  const health = ans.join(" ")

  if (health == null){
    res.json({
      confirmation: 'fail',
      message: 'Please enter a query paramter!'
    })
    return
  }

  // only if the parameters are defined

    const endpoint = 'https://api.edamam.com/search'
    let query = {
      app_key: process.env.EDAMAM_KEY,
      app_id: process.env.EDAMAM_ID
    }

    if( ingr ) { query["q"] = ingr; }
    if( health ) { query["health"] = health; }
    if( meal ) { query["meal"] = meal; }

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

router.get('/recipe', (req, res, next) => {

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
