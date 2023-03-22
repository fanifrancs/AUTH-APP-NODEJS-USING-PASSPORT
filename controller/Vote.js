const User = require('../model/userSchema')
const Voting = require('../model/VotersVotes')
const customError = require('../errors')
const response = require('../response/response')
const { StatusCodes } = require('http-status-codes')
const Candidate = require('../model/CandidtaeReg')


const oyaVote = async (req, res) => {

    const { candidateId, electionType } = req.body

    if (!candidateId || !electionType) {

        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'Please provide valid credentials',
            status: StatusCodes.BAD_REQUEST
        }))
    }

    req.body.user = req.user.userId

    const checkCandidate = await Candidate.findOne({ candidateId })

    if (!checkCandidate) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'Oops, there is no candidate found',
            status: StatusCodes.BAD_REQUEST
        }))
    }

    const hasVoted = await Voting.findOne({ user: req.user.userId })

    if (hasVoted) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'User have already voted',
            status: StatusCodes.BAD_REQUEST
        }))
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


};

const countVote = async (req, res) => {
    try {
        const candidates = await Candidate.find({}, '_id partyName image');
        const voteCounts = {};

        for (const candidate of candidates) {
            const candidateId = candidate._id;
            const voteCount = await Voting.countDocuments({ candidateId });
            voteCounts[candidateId] = {
                voteCount,
                partyName: candidate.partyName,
                image: candidate.image
            };
        }

        return res.status(StatusCodes.OK).json(response({ data: voteCounts }));

    } catch (error) {
        console.log(console.error)
    }
};


module.exports = {
    oyaVote,
    countVote
}
