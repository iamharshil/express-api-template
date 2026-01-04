import { ApiKeyRepository, ApiKey } from '../../shared/repositories/ApiKeyRepository';
import mongoose, { Schema, Document } from 'mongoose';

interface ApiKeyDoc extends Document, Omit<ApiKey, 'id'> { }

const ApiKeySchema = new Schema<ApiKeyDoc>({
    keyHash: { type: String, required: true, unique: true },
    userId: { type: String },
    scopes: { type: [String], default: [] },
}, { timestamps: true });

const ApiKeyModel = mongoose.model<ApiKeyDoc>('ApiKey', ApiKeySchema);

export class MongoApiKeyRepository implements ApiKeyRepository {
    async findByKeyHash(hash: string): Promise<ApiKey | null> {
        const doc = await ApiKeyModel.findOne({ keyHash: hash });
        return doc ? this.map(doc) : null;
    }

    async create(apiKey: Partial<ApiKey>): Promise<ApiKey> {
        const doc = await ApiKeyModel.create(apiKey);
        return this.map(doc);
    }

    private map(doc: ApiKeyDoc): ApiKey {
        return {
            id: doc._id.toString(),
            keyHash: doc.keyHash,
            userId: doc.userId,
            scopes: doc.scopes,
            createdAt: doc.createdAt as Date,
        };
    }
}
