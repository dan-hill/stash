import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: String,
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

export const Category = mongoose.model('Category', CategorySchema);
