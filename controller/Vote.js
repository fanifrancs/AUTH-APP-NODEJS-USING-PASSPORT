const User = require('../model/userSchema')
const State = require('../model/State')
const Voting = require('../model/VotersVotes')
const customError = require('../errors')
const response = require('../response/response')
const { StatusCodes } = require('http-status-codes')
const Candidate = require('../model/CandidtaeReg')



const oyaVote = async (req, res) => {

    const { candidateId, electionType } = req.body

    if (!candidateId || !electionType) {

        throw new customError.NotFoundError('please provide valid credentials')
    }

    req.body.user = req.user.userId

    const checkCandidate = await Candidate.findOne({ candidateId })

    if (!checkCandidate) {
        throw new customError.NotFoundError('Oops, there is no candidate found')
    }

    const hasVoted = await Voting.findOne({ candidateId })

    if (hasVoted) {
        throw new customError.NotFoundError('You have already voted')
    }

    const user = await User.findOne({ _id: req.user.userId })


    const newVote = {
        candidateId,
        name: req.user.name,
        votersId: user.NIN,
        electionType,
        user: user._id
    }

    await Voting.create(newVote)


    res.status(StatusCodes.CREATED).json(response({ msg: 'Congratulations you have voted successfully' }))


}



module.exports = {
    oyaVote
}