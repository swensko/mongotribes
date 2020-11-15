var express = require('express')
var passport = require('passport')
var router = express.Router()
var mongoose = require('mongoose')
var User = mongoose.model('User')
var Village = mongoose.model('Village')
var Job = mongoose.model('Job')

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }

router.post('/', checkAuthenticated, (req, res) => {
    var job = new Job({
        jobType: req.body.jobType,
        requester: {
            username: req.body.requesterName,
            villageid: req.body.requesterVillage
        },
        troops: {
            axe: req.body.axe,
            sword: req.body.sword
        }
    })
    console.log(req.body.jobType)
    if (job.jobType == 'recruit') {
        job.target = {
            username: req.body.requesterName,
            villageid: req.body.requesterVillage
        }
        var addToDate = ( job.troops.axe * 60000) + (job.troops.sword * 50000)
        job.dateFinished = Date.now() + addToDate
        console.log('saving ' + job)
        job.save()
    }
    res.redirect('/villages/'+req.body.requesterVillage)
})

module.exports = router