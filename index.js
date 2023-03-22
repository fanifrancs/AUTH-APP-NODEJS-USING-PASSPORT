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
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const cloudinary = require('cloudinary').v2

const connectDb = require('./db/connect')
const route = require('./Router/userrouter')
const settingsRoute = require('./Router/settings')
const candidateReg = require('./Router/candidates')


app.use(express.static('./public'))
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET
})


if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'))
}

app.set('trust proxy', 1)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
}))


app.use(cookies(process.env.JWT_SECRET))
app.use(helmet())
app.use(xss())

//route

app.use(cors({
  origin:'https://localhost:3000',
  credentials:true
}))

app.use('/api/v1', candidateReg)
app.use('/api/v1', settingsRoute)
app.use('/api/v1', route)




const start = async () => {
    try {
      await connectDb(process.env.MONGO_URI)
  
      
    } catch (error) {
     console.log(error)
    }
  }
  
  start().then(()=>{
    app.listen(port, () => console.log(`App is listening on port ${port}`))
  })


