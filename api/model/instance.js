import mongoose from "mongoose";

const InstanceSchema = new mongoose.Schema({
    name: String,
    instance: {
        type: String,
        ref: 'Instance'
    },
    minimum_quantity: Number,
    quantity: Number,
    transferable: Boolean,
})

export const Instance = mongoose.model('Instance', InstanceSchema);
