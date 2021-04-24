const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

  res.json({
    data: [
      {name:'Learn Programming', path:'learnprogramming'},
      {name:'JavaScript', path:'javascript'},
      {name:'NFL', path:'nfl'}
    ]
  })

})


module.exports = router
