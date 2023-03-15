const mongoose = require('mongoose')

const ElectionInfo = new mongoose.Schema({

    party: {
        type: String,
        required:true

    },
    votersId: {
        type: String,
        required: true
    },
    voteDate: {
        type: Date,
        default: date.now
    },
    electionType: {
        type: string,
        required: true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    }

})