
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
//Routes
/////////////////////////////////////////////////////////////////////////////
// Index
var indexRouter = require('./routes/index')
app.use('/', indexRouter)
// /login
var loginRoute = require('./routes/login')
app.use('/login', loginRoute)
// /register
var registerRoute = require('./routes/register')
app.use('/register', registerRoute)
// /logout
var logoutRoute = require('./routes/logout')
app.use('/logout', logoutRoute)
// /villages
var villageRoute = require('./routes/villages')
app.use('/villages', villageRoute)
// /jobs
var jobRoute = require('./routes/job')
app.use('/job', jobRoute)
/////////////////////////////////////////////////////////////////////////////
// server scripts
/////////////////////////////////////////////////////////////////////////////
var serverScripts = require('./serverScripts')
setInterval(serverScripts.tickRSS, 30 * 1000)
setInterval(serverScripts.checkJobs, 3 * 1000)
/////////////////////////////////////////////////////////////////////////////
// listen on port 3000
date = Date.now()
date2 = Date.now()
setTimeout(() => {date2 = Date.now();console.log(date > date2)}, 1000)

app.listen(3000)