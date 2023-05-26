import mongoose from "mongoose";

const SourceSchema = new mongoose.Schema({
    name: String,
    url: String,
    price: Number,
})

export const Source = mongoose.model('Source', SourceSchema);
