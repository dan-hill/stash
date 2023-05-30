import {Category} from "../model/category.js";
import mongoose from "mongoose";

export const findCategory = async (parent, args) => {
    return Category.findById(args._id);
}

export const findCategories = async () => {
    return Category.find();
}

export const createCategory = async (_, { input }) => {
    return Category.create(input);
}

export const deleteCategory = async (_, { _id }) => {
    const category = await Category.findById(new mongoose.Types.ObjectId(_id)).exec();
    if (!category) {
        throw new Error('Category not found');
    }
    await Category.deleteOne({ _id: category._id });
    return _id;
}

export const updateCategory = async (_, { categoryId, input }) => {
    const category = await Category.findById(new mongoose.Types.ObjectId(categoryId)).exec();
    if (!category) {
        throw new Error('Category not found');
    }
    Object.assign(category, input);
    await category.save();
    return category;
}