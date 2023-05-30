import {Source} from "../model/source.js";
import {Thing} from "../model/thing.js";
import mongoose from "mongoose";

export const findSources = async () => await Source.find()

export const createSource = async (_, { thingId, input }) => {
    const source = await Source.create(input);
    const thing =  await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
    console.log('thing.sources', thing.sources)
    thing.sources.push(source._id);
    await thing.save();
    return source;
}

export const updateSource = async (_, { sourceId, input }) => {
    const source = await Source.findById(new mongoose.Types.ObjectId(sourceId)).exec();
    if (!source) {
        throw new Error('Attribute not found');
    }
    Object.assign(source, input);
    await source.save();
    return source;
}

export const deleteSource = async (_, { sourceId, thingId }) => {
    const source = await Source.findById(new mongoose.Types.ObjectId(sourceId)).exec();
    if (!source) {
        throw new Error('Attribute not found');
    }
    const thing = await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
    if (!thing) {
        throw new Error('Thing not found');
    }
    thing.sources = thing.sources.filter(sourceId => !sourceId.equals(source._id));
    await thing.save();
    await Source.deleteOne({ _id: source._id });
    return sourceId;
}