require('dotenv').config()
require('express-async-error')
const express = require('express')
const app = express()

const port = process.env.PORT || 8080


const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const morgan = require('morgan')
const cookies = require('cookie-parser')

const connectDb = require('./db/connect')
const route = require('./Router/userrouter')
const pages = require('./Router/pages')
const settingsRoute = require('./Router/settings')
const candidateReg = require('./Router/candidates')


app.use(express.static('./public'))
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.use(morgan('tiny'))

if (process.env.NODE_ENV === 'production') {

    //
}



app.use(cookies(process.env.JWT_SECRET))
app.use(cors())
app.use(helmet())

//route
app.use('/api/v1',candidateReg)
app.use('/api/v1', settingsRoute)
app.use('/api/v1', route)
app.use('/user', pages)





const start = async () => {

    await connectDb('mongodb://0.0.0.0:27017/AUTH_NODE')

    app.listen(port, () => console.log(`app is listening on port ${port}`))

}


start()


