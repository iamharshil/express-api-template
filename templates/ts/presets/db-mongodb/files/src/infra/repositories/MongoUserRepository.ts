import { UserRepository, User } from '../../shared/repositories/UserRepository';
import mongoose, { Schema, Document } from 'mongoose';

interface UserDoc extends Document, Omit<User, 'id'> { }

const UserSchema = new Schema<UserDoc>({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    roles: { type: [String], default: [] },
}, { timestamps: true });

const UserModel = mongoose.model<UserDoc>('User', UserSchema);

export class MongoUserRepository implements UserRepository {
    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id);
        return doc ? this.map(doc) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email });
        return doc ? this.map(doc) : null;
    }

    async create(user: Partial<User>): Promise<User> {
        const doc = await UserModel.create(user);
        return this.map(doc);
    }

    private map(doc: UserDoc): User {
        return {
            id: doc._id.toString(),
            email: doc.email,
            passwordHash: doc.passwordHash,
            roles: doc.roles,
            createdAt: doc.createdAt as Date,
            updatedAt: doc.updatedAt as Date,
        };
    }
}
