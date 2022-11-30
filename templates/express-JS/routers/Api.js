const express = require('express')
const Router = express.Router()
const ApiController = require('../controllers/ApiController')

Router.get('/', ApiController.index)

// You're routes here

module.exports = Router
