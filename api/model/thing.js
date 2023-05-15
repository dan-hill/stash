import mongoose from 'mongoose';

const ThingSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attribute'
    }],
    sources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source'
    }],
    instances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instance'
    }]
});


export const Thing = mongoose.model('Thing', ThingSchema);
