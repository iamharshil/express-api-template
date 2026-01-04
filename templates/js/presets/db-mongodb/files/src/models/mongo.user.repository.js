// Assuming Mongoose model definition needs to be here or imported
// For simplicity, defining schema here or we should have a separate model file. 
// Let's create a User model file in the same models directory for the preset.
import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true }
});
const UserModel = mongoose.model('User', UserSchema);
export const mongoUserRepository = {
    async findById(id) {
        const user = await UserModel.findById(id);
        if (!user)
            return null;
        return { id: user._id.toString(), email: user.email, username: user.username };
    },
    async findByEmail(email) {
        const user = await UserModel.findOne({ email });
        if (!user)
            return null;
        return { id: user._id.toString(), email: user.email, username: user.username };
    },
    async create(user) {
        const newUser = await UserModel.create(user);
        return { id: newUser._id.toString(), email: newUser.email, username: newUser.username };
    }
};
