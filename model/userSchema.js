const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name'],
        minlenght:6,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'please provide valid Email'
        }
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlenght:6
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    country: {
        type:mongoose.Types.ObjectId,
        ref:'State',
        default:true
    },
    state: {
        type:String,
        required:true,
    },
  
    NIN:{
        type:String,
        required:true,
        unique:true
    },
    verificationToken:String,
    
    verified:Date,
});


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


userSchema.methods.validatePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}


// isVerified:{
    //     type:Boolean,
    //     default:false
    // },


module.exports = mongoose.model('UserSchema', userSchema)