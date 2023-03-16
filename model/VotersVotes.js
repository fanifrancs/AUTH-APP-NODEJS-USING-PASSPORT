const mongoose = require('mongoose')

const ElectionInfo = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },

    votersId: {
        type: String,
        required: true
    },

    electionType: {
        type: mongoose.Types.ObjectId,
        ref: 'Election'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    candidateId: {
        type: mongoose.Types.ObjectId,
        ref: 'candidate',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})


module.exports = mongoose.model('CastVote',ElectionInfo)