var express = require('express')
var passport = require('passport')
var router = express.Router()

function checkNotAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
    return res.redirect('/')
}
next()
}

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login')
  })
  
router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router;