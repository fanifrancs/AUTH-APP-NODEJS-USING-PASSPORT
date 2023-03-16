const mongoose = require('mongoose');


const stateSchema = new mongoose.Schema({
  countryName: {
    type: String,
    required: true

  },
  stateName: [{
    type: String,
    required: true,
    unique: true
  
  } || null]
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);





