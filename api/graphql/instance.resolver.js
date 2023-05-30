import {Instance} from "../model/instance.js";
import {Thing} from "../model/thing.js";
import mongoose from "mongoose";

export const findInstances = async () => {
    return Instance.find()
}
export const createInstance = async (_, { owner, input }) =>{
    const instance = await Instance.create(input)   ;
    const thing =  await Thing.findById(new mongoose.Types.ObjectId(owner)).exec();
    thing.instances.push(instance._id);
    await thing.save();
    return instance;
}

export const updateInstance = async (_, { _id, input }) => {
    let instance = await Instance.findById(new mongoose.Types.ObjectId(_id)).exec();
    Object.assign(instance, input);
    await instance.save();
    return instance;
}

export const deleteInstance = async (_, { instanceId, thingId }) => {
    const instance = await Instance.findById(new mongoose.Types.ObjectId(instanceId)).exec();
    if (!instance) {
        throw new Error('Instance not found');
    }
    const thing = await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
    if (!thing) {
        throw new Error('Thing not found');
    }
    thing.instances = thing.instances.filter(attrId => !attrId.equals(instance._id));
    await thing.save();
    await Instance.deleteOne({ _id: instance._id });
    return instanceId;
}