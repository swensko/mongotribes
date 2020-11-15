
if (process.env.NODE_ENV !== 'production') { // if the NODE_ENV environment variable isn't set to production in the host system
  require('dotenv').config() // use the dotenv package to save environment variables in a .env file 
}
/////////////////////////////////////////////////////////////////////////////
//Imports/Config
/////////////////////////////////////////////////////////////////////////////
// import our database modules first
const mongoose = require('mongoose');
// establish database with ./models/db.js 
require('./models/db')
// rest of module imports
const express = require('express') // express framework
const bcrypt = require('bcrypt') // required for authentication
const passport = require('passport') // required for authentication
const flash = require('express-flash') // for showing errors on inputs
const session = require('express-session') // required for authentication
const passportLocalMongoose = require('passport-local-mongoose') // required for authentication
const methodOverride = require('method-override') // required for DELETE/PUT requests, can't get it to work for some reason?
const pug = require('pug') // view engine
const path = require('path'); // required for setting views dir
const { Router } = require('express'); // unused ??
// declare express object
const app = express()
// database schemas
const User = mongoose.model('User');
const Village = mongoose.model('Village')
// passport strategy based on User schema
var Store = require('express-session').Store;
var MongooseStore = require('mongoose-express-session')(Store);

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// express configuration
app.set('views', path.join(__dirname, 'views')) // set views dir
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET, // environment variable SESSION_SECRET
  resave: false,
  saveUninitialized: true,
  store: new MongooseStore({
    connection: mongoose
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
/////////////////////////////////////////////////////////////////////////////
//Middleware functions
/////////////////////////////////////////////////////////////////////////////
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
/////////////////////////////////////////////////////////////////////////////
//Routes
/////////////////////////////////////////////////////////////////////////////
// Index
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { username: req.user.username })
})
/////////////////////////////////////
// /login
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))
/////////////////////////////////////
// /register
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
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
/////////////////////////////////////
// /logout
app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
  console.log('USED GET /logout instead of delete')
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
/////////////////////////////////////
// /villages
app.get('/villages', checkAuthenticated, (req, res, next) => {
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
app.get('/villages/:id', checkAuthenticated, async (req, res) => {
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
app.get('/villages/:id/hq', checkAuthenticated, async (req, res) => {
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
app.get('/villages/:id/barracks', checkAuthenticated, async (req, res) => {
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
/////////////////////////////////////
// server scripts
var incrementResources = require('./incrementResources')
setInterval(incrementResources.run, 10000)

// listen on port 3000
app.listen(3000)