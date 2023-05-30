import {Attribute} from "../model/attribute.js";
import mongoose from "mongoose";
import {Thing} from "../model/thing.js";

export const findAttributes = async () => await Attribute.find()
export const createAttribute = async (_, { thingId, input }) => {
    console.log('createAttribute', input)
    const attribute = await Attribute.create(input);
    console.log('createAttribute', attribute)
    const thing =  await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
    thing.attributes.push(attribute._id);
    await thing.save();
    return attribute;
}

export const deleteAttribute = async (_, { attributeId, thingId }) => {
    const attribute = await Attribute.findById(new mongoose.Types.ObjectId(attributeId)).exec();
    if (!attribute) {
        throw new Error('Attribute not found');
    }
    const thing = await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
    if (!thing) {
        throw new Error('Thing not found');
    }
    thing.attributes = thing.attributes.filter(attrId => !attrId.equals(attribute._id));
    await thing.save();
    await Attribute.deleteOne({ _id: attribute._id });
    return attributeId;
}

export const updateAttribute = async (_, { attributeId, input }) => {
    const attribute = await Attribute.findById(new mongoose.Types.ObjectId(attributeId)).exec();
    if (!attribute) {
        throw new Error('Attribute not found');
    }
    Object.assign(attribute, input);
    await attribute.save();
    return attribute;
}