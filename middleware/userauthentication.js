const tokenModel = require('../model/token')
const { verifyToken, attachCookiesToResponse } = require('../utils/index')
const customError = require('../errors')


const authenticateUser = async (req, res, next) => {

    const { accessToken, refreshToken } = req.signedCookies

    try {
        if (accessToken) {
            const payload = verifyToken(accessToken)

            if (!payload) {
                throw new customError.UnauthenticatedError('Opps, you are not authenticated to access this route')
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
            throw new customError.UnauthenticatedError('invalid authentication')
        }


        attachCookiesToResponse({ res, user: payload.user, refreshToken: payload.refreshToken })

        req.user = payload

        next()

    } catch (error) {

        console.log(error)

        throw new customError.BadRequestError('something happened at the cookie verification')

    }

}


const checkPermission = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            throw new customError.BadRequestError('Invalid Authentication')
        }

        next()
    }
}




module.exports = {
    authenticateUser,
    checkPermission
}