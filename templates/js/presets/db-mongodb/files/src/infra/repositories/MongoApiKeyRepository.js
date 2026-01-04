import mongoose, { Schema } from 'mongoose';
const ApiKeySchema = new Schema({
    keyHash: { type: String, required: true, unique: true },
    userId: { type: String },
    scopes: { type: [String], default: [] },
}, { timestamps: true });
const ApiKeyModel = mongoose.model('ApiKey', ApiKeySchema);
export class MongoApiKeyRepository {
    async findByKeyHash(hash) {
        const doc = await ApiKeyModel.findOne({ keyHash: hash });
        return doc ? this.map(doc) : null;
    }
    async create(apiKey) {
        const doc = await ApiKeyModel.create(apiKey);
        return this.map(doc);
    }
    map(doc) {
        return {
            id: doc._id.toString(),
            keyHash: doc.keyHash,
            userId: doc.userId,
            scopes: doc.scopes,
            createdAt: doc.createdAt,
        };
    }
}
