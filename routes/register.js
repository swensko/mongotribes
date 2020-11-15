var express = require('express')
var passport = require('passport')
var mongoose = require('mongoose')
var router = express.Router()
var User = mongoose.model('User')

function checkNotAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
    return res.redirect('/')
}
next()
}

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register')
})
  
router.post('/', checkNotAuthenticated, async (req, res) => {
    try {
        let user = new User({
        username: req.body.username,
        email: req.body.email
        })
        User.register(user, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            res.render('register', { message: err.message})
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/')
        })
        })
    } catch {
        res.redirect('register')
}
console.log(req.body)
})

module.exports = router;