require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const DB = require('./config/Database')

const PORT = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const ApiRoute = require('./routers/Api')

app.use('/api', ApiRoute)

app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
)
