import mongoose from "mongoose";

const SourceSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    url: String,
    price: Number,
})

export const Source = mongoose.model('Source', SourceSchema);
