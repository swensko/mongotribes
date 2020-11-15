var express = require('express')
var passport = require('passport')
var mongoose = require('mongoose')
var router = express.Router()
var User = mongoose.model('User')
var Village = mongoose.model('Village')

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

router.get('/', checkAuthenticated, (req, res, next) => {
    Village.find({ owner: req.user.username}, (err, docs) =>{
      if (!err) {
        res.render('villageList', {username: req.user.username, data: docs})
      }
      else {
        console.log(err)
        res.redirect('/')
      }
    }).orFail()
  })
  // individual village view
router.get('/:id', checkAuthenticated, async (req, res) => {
    try {
      village = await Village.findById(req.params.id)
      if (village == null) {
          return res.status(404).json({ message: 'Cannot find village.' })
      }
    } catch (err) {
      return res.status(500).json( {message: err.message} )
    }
    res.village = village
    if (village.owner == req.user.username) {
      res.render('village', {village: village, username: req.user.username, isVillageOwner: true})
    }
    else {
      res.render('village', {village: village, username: req.user.username})
    }
})
  // headquarters
router.get('/:id/hq', checkAuthenticated, async (req, res) => {
    try {
      village = await Village.findById(req.params.id)
      if (village == null) {
          return res.status(404).json({ message: 'Cannot find village.' })
      }
    } catch (err) {
      return res.status(500).json( {message: err.message} )
    }
    res.village = village
    if (village.owner == req.user.username) {
      res.render('hq', {village: village, username: req.user.username, isVillageOwner: true})
    }
    else {
      res.render('village', {village: village, username: req.user.username})
    }
})
  // barracks
router.get('/:id/barracks', checkAuthenticated, async (req, res) => {
    try {
      village = await Village.findById(req.params.id)
      if (village == null) {
          return res.status(404).json({ message: 'Cannot find village.' })
      }
    } catch (err) {
      return res.status(500).json( {message: err.message} )
    }
    res.village = village
    if (village.owner == req.user.username) {
      res.render('barracks', {village: village, username: req.user.username, isVillageOwner: true})
    }
    else {
      res.render('village', {village: village, username: req.user.username})
    }
})

module.exports = router;