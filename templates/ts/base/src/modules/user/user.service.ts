import { UserRepository } from '../../shared/repositories/UserRepository';

// This will be injected via Bootstrap or a DI container
let userRepository: UserRepository;

export class UserService {
    public static setRepository(repo: UserRepository) {
        userRepository = repo;
    }

    public static async getUser(id: string) {
        if (!userRepository) throw new Error('UserRepository not initialized');
        return userRepository.findById(id);
    }
}
