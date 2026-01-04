import { Router } from 'express';
import userRoutes from './user/user.routes';
import authRoutes from './auth/auth.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
