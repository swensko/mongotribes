const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    points: {
        type: String
    }
  })
  userSchema.plugin(passportLocalMongoose)
  module.exports = mongoose.model('User', userSchema)