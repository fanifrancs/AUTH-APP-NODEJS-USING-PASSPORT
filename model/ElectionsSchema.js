const mongoose = require('mongoose')


const Elections = new mongoose.Schema({
    election: {
        type: mongoose.Types.ObjectId,
        ref: 'electionType',
        default: true
    },
    candidateID:{
        type: mongoose.Types.ObjectId,
        ref: 'candidate',
        default: true
    },

    // state: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'State',
    //     default: true
    // },
  
})




module.exports = mongoose.model('Election', Elections)