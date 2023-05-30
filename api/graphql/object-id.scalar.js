import {GraphQLScalarType} from "graphql/index.js";
import mongoose from "mongoose";
import {Kind} from "graphql/language/index.js";

export const ObjectId = new GraphQLScalarType({
    name: 'ObjectId',
    description: 'MongoDB ObjectId',
    parseValue(value) {
        console.log(value)
        return new mongoose.Types.ObjectId(value);
    },
    serialize(value) {
        return value.toString();
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new mongoose.Types.ObjectId(ast.value);
        }
        return null;
    },
});