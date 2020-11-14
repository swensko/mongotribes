if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const pug = require('pug')
const path = require('path')


require('./models/db')

const User = mongoose.model('User');

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { username: req.user.username })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  failureMessage: 'Invalid username/password.'
}))

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

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
  console.log('USED GET /logout instead of delete')
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

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

app.listen(3000)