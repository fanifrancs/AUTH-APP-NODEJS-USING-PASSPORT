
const User = require('../model/userSchema')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const response = require('../response/response')

//setting user profile

const updateUser = async (req, res) => {

    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { runValidators: true, new: true });

    res.status(StatusCodes.OK).json(response({ msg: `${user.email} and ${user.name} have been updated` }))

}


const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        throw new customError.BadRequestError('please input correct values')
    }

    const verifedUser = await User.findOne({ _id: req.user.userId })

    const comparedPassword = await verifedUser.validatePassword(oldPassword)

    if(comparedPassword){

      verifedUser.password = newPassword

      verifedUser.save()

      res.status(StatusCodes.OK).json(response({msg:'User password have been created'}))

    }else{
       
        res.status(StatusCodes.OK).json(response({msg:'An error occured while updating the user',data:error.message}))

    }

  
}





module.exports = {
    updateUser,
    updatePassword
}