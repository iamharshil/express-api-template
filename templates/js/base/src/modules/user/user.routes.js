import { Router } from 'express';
import * as UserController from './user.controller';
const router = Router();
router.get('/profile', UserController.getProfile);
export default router;
