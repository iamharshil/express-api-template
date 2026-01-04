import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.get('/profile', UserController.getProfile);

export default router;
