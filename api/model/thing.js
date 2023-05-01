import mongoose from 'mongoose';
import * as uuid from "uuid";


const entitySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4
    },
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
        key: String,
        value: String
    }],
    sources: [{
        name: String,
        url: String,
        price: Number,
    }],
    instances: [{
        thing: {
            type: String,
            ref: 'Thing'
        },
        base_quantity: Number,
        quantity: Number,

    }],
});

export const Thing = mongoose.model('Thing', entitySchema);
