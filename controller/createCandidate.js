const candidateUser = require('../model/CandidtaeReg');
const Election = require('../model/ElectionsSchema')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const response = require('../response/response')
const cloudinary = require('cloudinary').v2


const registerCandidate = async (req, res) => {

    const { candidateName, partyName, electionType } = req.body

    if (!candidateName || !partyName || !electionType) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'Empty filed please provide valid credentials',
            status: StatusCodes.BAD_REQUEST
        }))

    }

    const imagePath = req.file.path

    console.log(req.file)

    const maxSize = 1024 * 1024 * 5
    const fileSize = req.file.size

    if (fileSize > maxSize) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'file size threshold exceded, max 5mb',
            status: StatusCodes.BAD_REQUEST
        }))
    }


    const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'CandidateFilesPhoto',
        use_filename: true
    }, (error) => {
        if (error) {
            throw new customError.BadRequestError('There is a problem with uploading your file')
        }
    });

    const candidate = {
        candidateName: candidateName,
        partyName: partyName,
        image: result.secure_url,
        electionType: electionType
    };



    await candidateUser.create(candidate)

    res.status(StatusCodes.CREATED).json(response({ msg: `${candidate.candidateName} has been added successfully` }));

}


const getAllCandidate = async (req, res) => {

    const user = await candidateUser.find({})

    res.status(StatusCodes.OK).json(response({ msg: user, data: user.length }))

}


const getSingleCandidate = async (req, res) => {

    const { id: userId } = req.body

    const user = await candidateUser.findOne({ userId }) //.populate("votes")

    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'User credentials not found',
            status: StatusCodes.BAD_REQUEST
        }))
    }

    res.status(StatusCodes.OK).json(response({ data: user }))
}


const updateCandidateInfo = async (req, res) => {

    const { id: userId } = req.params

    const user = await candidateUser.findOneAndUpdate({ _id: userId }, req.body, { runValidators: true, new: true });

    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'Candidate cannot be updated',
            status: StatusCodes.BAD_REQUEST
        }))
    }

    res.status(StatusCodes.OK).json(response({ msg: `${user.candidateName} has been updated sucessfully` }))
}


const deleteCandidate = async (req, res) => {
    const { id: userId } = req.params

    const user = await candidateUser.findByIdAndDelete({ userId })

    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'Candidate cannot be delete',
            status: StatusCodes.BAD_REQUEST
        }))
    }

    await user.remove();

    res.status(StatusCodes.OK).json(response({ msg: `${user.candidateName} has been delected successfully` }))
}






module.exports = {
    registerCandidate,
    getAllCandidate,
    getSingleCandidate,
    updateCandidateInfo,
    deleteCandidate
}



