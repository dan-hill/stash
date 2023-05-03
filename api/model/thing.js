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
        _id: mongoose.Types.ObjectId,
        key: String,
        value: String
    }],
    sources: [{
        _id: mongoose.Types.ObjectId,
        name: String,
        url: String,
        price: Number,
    }],
    instances: [{
        _id: mongoose.Types.ObjectId,
        thing: {
            type: String,
            ref: 'Thing'
        },
        base_quantity: Number,
        quantity: Number,

    }],
});

export const Thing = mongoose.model('Thing', ThingSchema);
