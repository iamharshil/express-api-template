import mongoose from 'mongoose'

const ApiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
})

export = mongoose.model('Api', ApiSchema)
