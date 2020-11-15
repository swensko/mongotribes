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
        type: Number, 
        default: 0
    },
    resources: {
        clay: { type: Number, default: 0 },
        iron: { type: Number, default: 0 },
        wood: { type: Number, default: 0 }
    },
    troops: {
        inVillage: {
            axe: { type: Number, default: 0 },
            sword: {type: Number, default: 0}
        }
    },
    buildings: {
        hq: {
            type: Number,
            default: 1
        },
        barracks: {
            type: Number,
            default: 1
        },
        pit: {
            type:Number,
            default: 1
        },
        mine: {
            type: Number,
            default: 1
        },
        sawmill: {
            type: Number,
            default: 1
        },
        wall: {
            type: Number,
            default: 0
        }
    }
  });

mongoose.model('Village', villageSchema);