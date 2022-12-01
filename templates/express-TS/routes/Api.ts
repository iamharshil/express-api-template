import express from 'express'
let Router = express.Router()
import * as ApiController from '../controllers/ApiController'

Router.get('/', ApiController.all)

export = Router
