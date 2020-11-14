const mongoose = require('mongoose');

var villageSchema = new mongoose.Schema({
    owner: {
        type: String
    },
    name: {
        type: String
    },
    coords: {
        x: { type: Number },
        y: { type: Number }
    },
    points: {
        type: Number
    },
    troops: {
        inVillage: {
            axe: { type: Number }
        }
    }
  });

mongoose.model('Village', villageSchema);