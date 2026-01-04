import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    roles: { type: [String], default: [] },
}, { timestamps: true });
const UserModel = mongoose.model('User', UserSchema);
export class MongoUserRepository {
    async findById(id) {
        const doc = await UserModel.findById(id);
        return doc ? this.map(doc) : null;
    }
    async findByEmail(email) {
        const doc = await UserModel.findOne({ email });
        return doc ? this.map(doc) : null;
    }
    async create(user) {
        const doc = await UserModel.create(user);
        return this.map(doc);
    }
    map(doc) {
        return {
            id: doc._id.toString(),
            email: doc.email,
            passwordHash: doc.passwordHash,
            roles: doc.roles,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
