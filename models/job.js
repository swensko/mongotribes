const mongoose = require('mongoose');

var villageSchema = new mongoose.Schema({
    jobType: {
        type: String
    },
    requester: {
        username: { type: String },
        villageid: {type: String}
    },
    target: {
        username: { type: String },
        villageid: {type: String}
    },
    troops: {
        axe: { type: Number },
        sword: { type: Number }
    },
    dateFinished: {
        type: Date
    }
  });

mongoose.model('Village', villageSchema);