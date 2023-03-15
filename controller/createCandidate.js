const candidateUser = require('../model/CandidtaeReg');
const Election = require('../model/ElectionsSchema')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const response = require('../response/response')


const registerCandidate = async (req, res) => {

    const regCan = await candidateUser.create(req.body);

    res.status(StatusCodes.CREATED).json(response({ msg: `${regCan.candidateName} has been added successfully` }))

}


const getAllCandidate = async (req, res) => {

    const user = await candidateUser.find({})

    res.status(StatusCodes.OK).json(response({ msg: user, data: user.length }))

}


const getSingleCandidate = async (req, res) => {

    const { id: userId } = req.body

    const user = await candidateUser.findOne({ userId }) //.populate("votes")

    if (!user) {
        throw new customError.NotFoundError(`user with id ${userId} not found`)
    }

    res.status(StatusCodes.OK).json(response({ data: user }))
}


const updateCandidateInfo = async (req, res) => {

    const { id: userId } = req.params

    const user = await candidateUser.findOneAndUpdate({ _id: userId }, req.body, { runValidators: true, new: true });

    if (!user) {
        throw customError.NotFoundError('no candiddate to update')
    }

    res.status(StatusCodes.OK).json(response({ msg: `${user.candidateName} has been updated sucessfully` }))
}


const deleteCandidate = async (req, res) => {
    const { id: userId } = req.params

    const user = await candidateUser.findByIdAndDelete({ userId })

    if (!user) {
        throw new customError.NotFoundError('no candidate to delete')
    }

    await user.remove();

    res.status(StatusCodes.Ok).json(response({ msg: `${user.candidateName} has been delected successfully` }))
}


module.exports = {
    registerCandidate,
    getAllCandidate,
    getSingleCandidate,
    updateCandidateInfo,
    deleteCandidate
}