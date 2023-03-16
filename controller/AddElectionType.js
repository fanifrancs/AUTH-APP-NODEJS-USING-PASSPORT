const ElectionType = require('../model/ElectionTypeSchema')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const response = require('../response/response')
const { convertedDatetoString, checkExpired } = require('../utils')


const AddElection = async (req, res) => {

    const { electionName, beginAt, endAt } = req.body

    if (!electionName || !beginAt || !endAt) {
        throw new customError.NotFoundError('please provide valid credentials')

    }

    const createElection = await ElectionType.create({ electionName, beginAt, endAt })

    res.status(StatusCodes.CREATED).json(response({ msg: 'Election Type has been added successfully' }))
}


const getSingleElection = async (req, res) => {

    const { id: userId } = req.params

    const election = await ElectionType.findById(userId)

    if (!election) {
        throw new customError.BadRequestError('No election to get')
    }

    req.status(StatusCodes.OK).json(response({ data: election }))
}


const getAllElections = async (req, res) => {

    const election = await ElectionType.find({})

    const displayElection = election.map((el, label) => {

        const endDate = checkExpired(el.endAt)

        return {
            id:el._id,
            Name: el.electionName,
            Start: convertedDatetoString(el.beginAt),
            End: convertedDatetoString(el.endAt),
            status: endDate
        }
    })


    res.status(StatusCodes.OK).json(response({data:displayElection}))
}


const updateElection = async (req, res) => {

    const { id: userId } = req.params

    const updateProcess = await ElectionType.findByIdAndUpdate(userId, req.body, { runValidators: true, new: true })

    res.status(StatusCodes.OK).json(response({ msg: `${updateProcess.electionName} has been updated successfully` }))
}



const removeElection = async (req, res) => {
    const { id: userId } = req.params

    const removeProcess = await ElectionType.findByIdAndRemove(userId)

    if (!removeProcess) {
        throw new customError.NotFoundError('No election to remove')
    }

    await removeProcess.remove()

    res.status(StatusCodes.OK).json(response({ msg: `${removeProcess.electionName} has ben removed successfully` }))
}


module.exports = {
    AddElection,
    getAllElections,
    getSingleElection,
    updateElection,
    removeElection
}