import mongoose from 'mongoose';
import { env } from '../../config/env';

export const connectMongo = async () => {
    try {
        if (!env.DB_URI) throw new Error("DB_URI is not defined");
        await mongoose.connect(env.DB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
