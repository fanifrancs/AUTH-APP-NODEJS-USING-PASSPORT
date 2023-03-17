const express = require('express')
const router = express.Router()


const { registerUser, loginUser, logout } = require('../controller/user')

const { authenticateUser } = require('../middleware/userauthentication')


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').delete(authenticateUser, logout)


module.exports = router
