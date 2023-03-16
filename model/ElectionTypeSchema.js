const mongoose = require('mongoose')


const ElectionTypes = new mongoose.Schema({
    electionName: {
        type: String,
        required: [true, 'please provide an election name'],
        min: 5,
        maxlength: 50
    },

    beginAt: {
        type: String,
        required:true
    },

    endAt:{
        type:String,
        required:true
    },
    status:{
        type:String
    }
})




module.exports = mongoose.model('electionType', ElectionTypes)