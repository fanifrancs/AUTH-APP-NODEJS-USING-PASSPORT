const express = require('express')
const router = express.Router()

const { registerCandidate, getAllCandidate, getSingleCandidate, updateCandidateInfo, deleteCandidate } = require('../controller/createCandidate')

const { authenticateUser, checkPermission } = require('../middleware/userauthentication')

const { AddStates, getAllState, removeState, updateStateInfo } = require('../controller/addState')


const { AddElection, getAllElections, getSingleElection, updateElection, removeElection } = require('../controller/AddElectionType')

//candiates

router.route('/add').post(authenticateUser, checkPermission("admin"), registerCandidate)
router.route('/add/:id').get(authenticateUser, checkPermission("admin"), getSingleCandidate)
router.route('/all').get(authenticateUser, getAllCandidate)
router.route('/updates/:id').patch(authenticateUser, checkPermission("admin"), updateCandidateInfo)
router.route('/delete/:id').delete(authenticateUser, checkPermission("admin"), deleteCandidate)

//States

router.route('/allStates').get(authenticateUser, checkPermission("admin"), getAllState)
router.route('/addState').post(authenticateUser, checkPermission("admin"), AddStates)
router.route('/removeState/:id').delete(authenticateUser, checkPermission("admin"), removeState)
router.route('/updateState/:id').patch(authenticateUser, checkPermission("admin"), updateStateInfo)




//Elections

router.route('/addElection').post(authenticateUser, checkPermission("admin"), AddElection)
router.route('/allElection').get(authenticateUser, getAllElections)
router.route('/SingleElection/:id').get(authenticateUser, checkPermission("admin"), getSingleElection)
router.route('/SingleElection/:id').patch(authenticateUser, checkPermission("admin"), updateElection)
router.route('/SingleElection/:id').delete(authenticateUser, checkPermission("admin"), removeElection)



module.exports = router