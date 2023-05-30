import {Thing} from "../model/thing.js";
import mongoose from "mongoose";
import {Instance} from "../model/instance.js";
import {Source} from "../model/source.js";

export const findThing = async (parent, args) => {
    return Thing.findById(args._id);
}

export const findThings = async () => {
    return Thing.find();
}

export const createThing = async (_, { input }) => {
    return Thing.create(input);
}

export const deleteThing = async (_, { _id }) => {
    const thing = await Thing.findById(new mongoose.Types.ObjectId(_id)).exec();
    if (!thing) {
        throw new Error('Thing not found');
    }
    await Instance.deleteMany({ _id: { $in: thing.instances } });
    await Source.deleteMany({ _id: { $in: thing.sources } });
    await Thing.deleteMany({ _id: { $in: thing.attributes } });
    await Thing.deleteOne({ _id: thing._id });
    return _id;
}

export const updateThing = async (_, { thingId, input }) => {
    const thing = await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
    if (!thing) {
        throw new Error('Thing not found');
    }
    Object.assign(thing, input);
    await thing.save();
    return thing;
}

