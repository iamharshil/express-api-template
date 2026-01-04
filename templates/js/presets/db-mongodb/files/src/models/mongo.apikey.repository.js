// Interface should be in ../apikey.repository
// defining simplified here for speed, assuming implementation matches eventual interface
import mongoose, { Schema } from 'mongoose';
const ApiKeySchema = new Schema({
    keyHash: { type: String, required: true },
    userId: { type: String, required: true },
    scopes: [String]
});
const ApiKeyModel = mongoose.model('ApiKey', ApiKeySchema);
export const mongoApiKeyRepository = {
    async findByKeyHash(hash) {
        const key = await ApiKeyModel.findOne({ keyHash: hash });
        if (!key)
            return null;
        return { userId: key.userId, scopes: key.scopes };
    }
};
