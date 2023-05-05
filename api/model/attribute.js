import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema({
    key: String,
    value: String
})

export const Attribute = mongoose.model('Attribute', AttributeSchema);
