const mongoose = require('mongoose')


const Elections = new mongoose.Schema({
    election: {
        type: mongoose.Types.ObjectId,
        ref: 'electionType',
        default: true
    },

    state: {
        type: mongoose.Types.ObjectId,
        ref: 'State',
        default: true
    },

    date: {
        type: Date,
        default: Date.now
    }
})




module.exports = mongoose.model('Election', Elections)