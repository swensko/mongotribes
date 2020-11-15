const mongoose = require('mongoose')
const { update } = require('./models/user')
require('./models/db')
const Village = mongoose.model('Village')
const Job = mongoose.model('Job')

async function incrementResources() {
    var villages = []
    await Village.find((err, docs) =>{
        if (!err) {
            docs.forEach((village) => {
                village.resources.clay += village.buildings.pit
                village.resources.wood += village.buildings.sawmill
                village.resources.iron += village.buildings.mine
                village.save()
            })
        }
        else {
            console.log(err)
        }
        }).orFail()
}

async function handleJob(job) {
    if (job.jobType == 'recruit') {
        console.log('Handling recruit job for ' + job.requester.username + '. Adding ' + job.troops.axe + ' axemen and '+ job.troops.sword + ' swordsmen.')
        var village =  await Village.findById(job.target.villageid)
        village.troops.inVillage.axe += job.troops.axe
        village.troops.inVillage.sword += job.troops.sword
        village.save()
        job.delete()
    }
}

async function checkJobs() {
    await Job.find({ dateFinished: {$lt: Date.now()} }, null, { sort: 'dateFinished'}, (err, docs) => {
        console.log('Displaying jobs.......')
        docs.forEach((job) => {
            handleJob(job)
        })
    })
}

exports.tickRSS = incrementResources
exports.checkJobs = checkJobs