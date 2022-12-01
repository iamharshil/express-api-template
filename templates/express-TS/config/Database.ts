import mongoose, { ConnectOptions } from 'mongoose'

export async function database() {
    const URL: string = process.env.MONG_URL!
    return await mongoose.connect(
        URL,
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions,
        function (error) {
            if (error) {
                return console.log({ error: error.message })
            }
            console.log('Database connected')
        }
    )
}

// export default database
// .then(() => console.log('Database connected'))
// .catch((error) => console.log({ error: error.message }))
