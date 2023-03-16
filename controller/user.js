const User = require('../model/userSchema')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const crypto = require('crypto')
const response = require('../response/response')
const tokenModel = require('../model/token')
const { createTokenUser, attachCookiesToResponse } = require('../utils/index')





module.exports = {

    getWelcomePage: async (req, res) => {

        res.render('register')

    },


    registerUser: async (req, res) => {

        const { name, email, password, password2, state, country, NIN } = req.body

        const chechUser = await User.findOne({ email })

        if (chechUser) {
            throw new customError.BadRequestError('user email already exists')
        }

        if (!name || !email || !password || !password2  || !state || !country || !NIN) {
            throw new customError.BadRequestError('please provide valid credentials')
        }

        if (password !== password2) {

            throw new customError.BadRequestError('please provide valid credentials')

        }



        const tokenVerification = crypto.randomBytes(25).toString('hex')

        const adminUser = (((await User.countDocuments({}) === 0)));
        const role = adminUser ? "admin" : "user"



        const user = await User.create({ name, email, password, role, state, country, NIN, tokenVerification })

        // verify

        res.status(StatusCodes.OK).json(response({ msg: `${user.name} have been logged in successfully` }))

    },

    loginUser: async (req, res) => {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            throw new customError.BadRequestError('There is no user with this email')
        }

        const checkpassword = await user.validatePassword(password)

        if (!checkpassword) {
            throw new customError.BadRequestError('please provide a valid password')
        }


        const tokenuser = createTokenUser(user);

        let refreshToken = ''

        refreshToken = crypto.randomBytes(35).toString('hex')


        const checkToken = await tokenModel.findOne({ user: user._id })

        if (checkToken) {

            const { isValid } = checkToken

            if (!isValid) {
                throw new customError.UnauthenticatedError('you are verified yet to loggin please try again')
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
        res.status(StatusCodes.OK).json(response({ data: tokenuser }))

    },

    logout: async (req, res) => {
        await tokenModel.findOneAndDelete(req.user.userId)

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