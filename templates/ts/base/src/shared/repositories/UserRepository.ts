export interface User {
    id: string;
    email: string;
    passwordHash?: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
}
