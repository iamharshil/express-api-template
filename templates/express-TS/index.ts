import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import { database } from './config/Database'

const PORT = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

import ApiRoute from './routes/Api'

app.use('/api', ApiRoute)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
