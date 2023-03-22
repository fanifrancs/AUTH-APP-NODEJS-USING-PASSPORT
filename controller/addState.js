const State = require('../model/State')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const response = require('../response/response')


const AddStates = async (req, res) => {

    const { countryName, stateName } = req.body

    if (!countryName || !stateName) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'please provide countryName and stateName',
            status: StatusCodes.BAD_REQUEST
        }))
    }

    const user = await State.create(req.body)

    res.status(StatusCodes.OK).json(response({ msg: `${user.countryName} and ${user.stateName} has been added` }))

}

const getAllState = async (req, res) => {

    const AllState = await State.find({})

    res.status(StatusCodes.OK).json(response({ msg: AllState, data: AllState.length }))
}


const updateStateInfo = async (req, res) => {

    const updateState = await State.findByIdAndUpdate(req.parms.id, req.body, { runValidators: true, new: true })

    res.staus(StatusCodes.OK).json(response({ msg: `Update Successful` }))
}



const removeState = async (req, res) => {

    const { id: userId } = req.params

    const user = await State.findByIdAndDelete({ userId });

    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(response({
            msg: 'State information not found',
            status: StatusCodes.BAD_REQUEST
        }))
    }

    await user.remove()

    res.status(StatusCodes.OK).json(response({ msg: `${user.stateName.name} has been removed` }))


}


module.exports = {
    AddStates,
    removeState,
    getAllState,
    updateStateInfo
}