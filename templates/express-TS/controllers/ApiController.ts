import { Request, Response } from 'express'
import APiModel from '../models/ApiModel'

let all = (req: Request, res: Response) => {
    res.send('Welcome to api')
}
let create = (req: Request, res: Response) => {
    res.send('Welcome to api')
}
let read = (req: Request, res: Response) => {
    res.send('Welcome to api')
}
let update = (req: Request, res: Response) => {
    res.send('Welcome to api')
}
let remove = (req: Request, res: Response) => {
    res.send('Welcome to api')
}

export { all, create, read, update, remove }
