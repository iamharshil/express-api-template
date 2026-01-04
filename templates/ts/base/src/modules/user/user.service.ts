import { UserRepository } from '../../models/user.repository';

// This will be injected via Bootstrap
let userRepository: UserRepository;

export const setUserRepository = (repo: UserRepository) => {
    userRepository = repo;
};

export const getUser = async (id: string) => {
    if (!userRepository) throw new Error('UserRepository not initialized');
    return userRepository.findById(id);
};
