import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';


const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes will be mounted by modules in Bootstrap or here.
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

export default app;
