const tokenModel = require('../model/token')
const { verifyToken, attachCookiesToResponse } = require('../utils/index')
const customError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const response = require('../response/response')


const authenticateUser = async (req, res, next) => {

    const { accessToken, refreshToken } = req.signedCookies

    try {
        if (accessToken) {
            const payload = verifyToken(accessToken)

            if (!payload) {
                res.status(StatusCodes.BAD_REQUEST).json(response({
                    msg: 'Opps, you are not authenticated to access this route',
                    status: StatusCodes.BAD_REQUEST
                }))
            }

            req.user = payload.user

            return next();
        }

        const payload = verifyToken(refreshToken)

        let checkRefreshToken = await tokenModel.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        })


        if (!checkRefreshToken && !checkRefreshToken?.isValid) {
            res.status(StatusCodes.BAD_REQUEST).json(response({
                msg: 'invalid authentication',
                status: StatusCodes.BAD_REQUEST
            }))

        }


        attachCookiesToResponse({ res, user: payload.user, refreshToken: payload.refreshToken })

        req.user = payload

        next()

    } catch (error) {

        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'something happened at the cookie verification',
            status: StatusCodes.BAD_REQUEST
        }))

    }

}


const checkPermission = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            res.status(StatusCodes.BAD_REQUEST).json(response({
                msg: 'Invalid Authentication',
                status: StatusCodes.BAD_REQUEST
            }))

        }

        next()
    }
}




module.exports = {
    authenticateUser,
    checkPermission
}