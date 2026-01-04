import mongoose from 'mongoose';
import { env } from '../../config/env';

export const connectMongo = async () => {
    try {
        // env.DB_URI would need to be added to env.ts by the preset logic ideally,
        // or we assume it exists.
        const uri = process.env.DB_URI || 'mongodb://localhost:27017/express-api';
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error', error);
        process.exit(1);
    }
};
