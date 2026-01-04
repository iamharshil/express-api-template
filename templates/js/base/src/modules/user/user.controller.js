import { UserService } from './user.service';
import { StatusCodes } from 'http-status-codes';
export class UserController {
    static async getProfile(req, res) {
        // In a real app, userId comes from AuthContext
        const userId = "some-id";
        const user = await UserService.getUser(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        return res.json(user);
    }
}
