import mongoose from 'mongoose';

const ThingSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        default: '',
        unique: true
    },
    summary: {
        type: String,
    },
    category: {
        type: String,
    },
    subcategory: {
        type: String,
    },
    user: {
        type: String
    },
    attributes: [{
        type: String,
        ref: 'Source'
    }],
    sources: [{
        type: String,
        ref: 'Source'
    }],
    instances: [{
        type: String,
        ref: 'Instance'
    }]
});

export const Thing = mongoose.model('Thing', ThingSchema);
