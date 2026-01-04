// This will be injected via Bootstrap
let userRepository;
export const setUserRepository = (repo) => {
    userRepository = repo;
};
export const getUser = async (id) => {
    if (!userRepository)
        throw new Error('UserRepository not initialized');
    return userRepository.findById(id);
};
