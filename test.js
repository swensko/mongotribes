const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = mongoose.model('User')

function initialize(passport, getUserByEmail, getUserById) {

}

module.exports = initialize