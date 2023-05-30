import {authenticate, getUser} from "../service/fusion_auth.js";
import {User} from "../model/user.js";
import mongoose from "mongoose";

export const findUser = async (parent, args, context) => {
    return getUser(context);
}

export const findMe = async (_, __, context) => {
    const userId = await authenticate(context);
    if (!userId) {
        throw new Error('Not authenticated');
    }
    const user = await getUser(context);

    let userModel = await User.findOne({ _authId: userId });

    if (!userModel) {
        userModel = new User({
            _id: new mongoose.Types.ObjectId(),
            _authId: userId,
            email: user.email,
        });

        await userModel.save();
    }

    return {
        _id: userModel._id,
        email: userModel.email,
    };
}