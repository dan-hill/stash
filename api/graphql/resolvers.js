import { Thing } from "../model/thing.js";
import { Instance } from "../model/instance.js";
import { Source } from "../model/source.js";
import { Attribute } from "../model/attribute.js";
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language/kinds.mjs';
import mongoose from 'mongoose';

const ObjectId = new GraphQLScalarType({
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

const resolvers = {
    ObjectId,
    Query: {
        thing: async (parent, args) => await Thing.findById(args._id),
        things: async () => await Thing.find(),
        instances: async () => await Instance.find(),
        sources: async () => await Source.find(),
        attributes: async () => await Attribute.find()
    },
    Mutation: {
        createThing: async (_, { input }) => await Thing.create(input),
        createInstance: async (_, { input }) => await Instance.create(input),
        createSource: async (_, { input }) => await Source.create(input),
        createAttribute: async (_, {thingId, input }) => {
            const attribute = await Attribute.create(input);
            const thing =  await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
            thing.attributes.push(attribute._id);
            await thing.save();
            return attribute;
        },
    },
    Thing: {
        attributes: async (parent) => await Attribute.find({ _id: { $in: parent.attributes } }),
        sources: async (parent) => await Source.find({ _id: { $in: parent.sources } }),
        instances: async (parent) => await Instance.find({ _id: { $in: parent.instances } }),
    },
    Instance: {
        thing: async (parent) => await Thing.findById(parent.thing)
    }
};

export default resolvers;
