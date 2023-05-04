import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    key: String,
    value: String
})

export const Attribute = mongoose.model('Attribute', AttributeSchema);
