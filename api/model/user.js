import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    _authId: {
        type: String,
    },
    email: {
        type: String,
    }
});


export const User = mongoose.model('User', UserSchema);
