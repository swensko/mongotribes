var express = require('express')
var passport = require('passport')
var router = express.Router()

function checkNotAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
    return res.redirect('/')
}
next()
}
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index', { username: req.user.username })
  })

module.exports = router;