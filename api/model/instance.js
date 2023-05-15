import mongoose from "mongoose";

const InstanceSchema = new mongoose.Schema({
    thing: {
        type: String,
        ref: 'Thing'
    },
    base_quantity: Number,
    quantity: Number,
})

export const Instance = mongoose.model('Instance', InstanceSchema);
