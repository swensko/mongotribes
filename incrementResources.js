const mongoose = require('mongoose')
const { update } = require('./models/user')
require('./models/db')
const Village = mongoose.model('Village')

async function run() {
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

exports.run = run