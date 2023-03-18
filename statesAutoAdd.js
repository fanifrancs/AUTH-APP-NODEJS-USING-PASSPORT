require('dotenv').config()
const State = require('./model/State')
const connectDb = require('./db/connect')
const jsonFile = require('./data.json')


const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI)
        await State.create(jsonFile)
        console.log('success added the files')
        process.exit(0)

    } catch (error) {
        console.log(error.message)
        process.exit(1)

    }
}

start()




