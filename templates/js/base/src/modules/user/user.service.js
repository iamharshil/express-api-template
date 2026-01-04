// This will be injected via Bootstrap or a DI container
let userRepository;
export class UserService {
    static setRepository(repo) {
        userRepository = repo;
    }
    static async getUser(id) {
        if (!userRepository)
            throw new Error('UserRepository not initialized');
        return userRepository.findById(id);
    }
}
