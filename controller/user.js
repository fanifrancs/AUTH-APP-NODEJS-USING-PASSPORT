const User = require('../model/userSchema')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const crypto = require('crypto')
const response = require('../response/response')
const tokenModel = require('../model/token')
const { createTokenUser, attachCookiesToResponse } = require('../utils/index')



module.exports = {

    registerUser: async (req, res) => {

        const { name, email, password, password2, state, country, NIN } = req.body

        const chechUser = await User.findOne({ email })

        if (chechUser) {
            res.status(StatusCodes.BAD_REQUEST).json(response({
                msg: 'User already exists',
                status: StatusCodes.BAD_REQUEST
            }))
        }

        if (!name || !email || !password || !password2 || !state || !country || !NIN) {
            res.status(StatusCodes.BAD_REQUEST).json(response({
                msg: 'Please provide valid credentials',
                status: StatusCodes.BAD_REQUEST
            }))
        }

        if (password !== password2) {

            res.status(StatusCodes.BAD_REQUEST).json(response({
                msg: 'Please provide valid credentials',
                status: StatusCodes.BAD_REQUEST
            }))

        }



        const tokenVerification = crypto.randomBytes(25).toString('hex')

        const adminUser = (((await User.countDocuments({}) === 0)));
        const role = adminUser ? "admin" : "user"



        const user = await User.create({ name, email, password, role, state, country, NIN, tokenVerification })
        // verify
        res.status(StatusCodes.OK).json(response({ msg: `${user.name} have been registered in successfully` }))

    },

    loginUser: async (req, res) => {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            res.status(StatusCodes.BAD_REQUEST).json(response({
                msg: 'There is no user with this email',
                status: StatusCodes.BAD_REQUEST
            }))
        }

        const checkpassword = await user.validatePassword(password)

        if (!checkpassword) {
            res.status(StatusCodes.BAD_REQUEST).json(response({
                msg: 'Please provide a valid password',
                status: StatusCodes.BAD_REQUEST
            }))
        }


        const tokenuser = createTokenUser(user);

        let refreshToken = ''

        refreshToken = crypto.randomBytes(35).toString('hex')


        const checkToken = await tokenModel.findOne({ user: user._id })

        if (checkToken) {

            const { isValid } = checkToken

            if (!isValid) {
                res.status(StatusCodes.BAD_REQUEST).json(response({
                    msg: 'you are not verified yet, please login',
                    status: StatusCodes.NOT_FOUND
                }))
            }

            refreshToken = checkToken.refreshToken

            attachCookiesToResponse({ res, user: tokenuser, refreshToken })

            res.status(StatusCodes.OK).json(response({ data: tokenuser }))

            return;
        }

        let ip = req.ip
        let userAgent = req.headers['user-agent']

        const tokenUser = {
            ip,
            userAgent,
            refreshToken,
            user: user._id
        }





        await tokenModel.create(tokenUser)
        attachCookiesToResponse({ res, user: tokenuser, refreshToken })


        //Am coming back to it

        // if (checkToken && checkToken.userAgent !== userAgent) {

        //     //sendMail

        //     await tokenModel.updateOne(
        //       { user: user._id },
        //       { $set: { userAgent } }
        //     );
        //   }


        res.status(StatusCodes.OK).json(response({ msg: tokenuser }))

    },



    logout: async (req, res) => {
        await tokenModel.findOneAndDelete({ user: req.user.userId })

        res.cookie('accessToken', 'logout', {
            httpOnly: true,
            expires: new Date(Date.now()),
        });

        res.cookie('refreshToken', 'logout', {
            httpOnly: true,
            expires: new Date(Date.now()),
        });

        res.status(StatusCodes.OK).json({ msg: 'user logged out!' });

    }

}