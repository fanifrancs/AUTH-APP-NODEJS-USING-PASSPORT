const mongoose = require('mongoose')


const ElectionTypes = new mongoose.Schema({
    electionName: {
        type: String,
        required: [true, 'please provide an election name'],
        min: 5,
        maxlength: 50
    },

    beginAt: {
        type: Date,
    },

    endAt:{
        type:Date,
    }
})




module.exports = mongoose.model('electionType', ElectionTypes)