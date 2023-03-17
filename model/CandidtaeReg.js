const mongoose = require('mongoose')

const candidateRegistration = new mongoose.Schema({
    candidateName: {
        type: String,
        required: [true, 'please provide candidates name'],
        minlength: 3,
        maxlength: 50
    },
    partyName: {
        type: String,
        required: true,
        min: 5,
        maxlength: 20
    },
    candidateImage: {
        type: String,
        default: '/uploads/example.jpeg'
    },
    electionType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})



module.exports = mongoose.model('candidate', candidateRegistration)