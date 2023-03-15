const express = require('express')
const router = express.Router()

const { registerCandidate, getAllCandidate, getSingleCandidate, updateCandidateInfo, deleteCandidate } = require('../controller/createCandidate')

const { authenticateUser, checkPermission } = require('../middleware/userauthentication')

const { AddStates, removeState } = require('../controller/addState')



router.route('/add').post(authenticateUser, checkPermission("admin"), registerCandidate)
router.route('/add/:id').get(authenticateUser, checkPermission("admin"), getSingleCandidate)
router.route('/all').get(authenticateUser, getAllCandidate)
router.route('/updates/:id').patch(authenticateUser, checkPermission("admin"), updateCandidateInfo)
router.route('/delete/:id').delete(authenticateUser, checkPermission("admin"), deleteCandidate)


router.route('/addState').post(authenticateUser, checkPermission("admin"), AddStates)
router.route('/removeState/:id').delete(authenticateUser, checkPermission("admin"), removeState)



module.exports = router