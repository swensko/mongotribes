var express = require('express')
var passport = require('passport')
var router = express.Router()

router.get('/', (req, res) => {
    req.logOut()
    res.redirect('/login')
    console.log('USED GET /logout instead of delete')
})
  
router.delete('/', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

module.exports = router;