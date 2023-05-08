import { Thing } from "../model/thing.js";
import { Instance } from "../model/instance.js";
import { Source } from "../model/source.js";
import { Attribute } from "../model/attribute.js";
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language/kinds.mjs';
import mongoose from 'mongoose';
import {authenticate, getUser} from "../service/fusion_auth.js";
import {User} from "../model/user.js";

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
        attributes: async () => await Attribute.find(),
        user: async (parent, args, context) => {
            const user = await getUser(context);
        },
        me: async (_, __, context) => {
            const userId = await authenticate(context);
            if (!userId) {
                throw new Error('Not authenticated');
            }
            const user = await getUser(context);

            let userModel = await User.findOne({ _authId: userId });

            if (!userModel) {
                userModel = new User({
                    _id: new mongoose.Types.ObjectId(),
                    _authId: userId,
                    email: user.email,
                });

                await userModel.save();
            }

            return {
                _id: userModel._id,
                email: userModel.email,
            };
        },
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
        updateAttribute: async (_, { attributeId, input }) => {
            const attribute = await Attribute.findById(new mongoose.Types.ObjectId(attributeId)).exec();
            if (!attribute) {
                throw new Error('Attribute not found');
            }
            Object.assign(attribute, input);
            await attribute.save();
            return attribute;
        },

        deleteAttribute: async (_, { attributeId, thingId }) => {
            const attribute = await Attribute.findById(new mongoose.Types.ObjectId(attributeId)).exec();
            if (!attribute) {
                throw new Error('Attribute not found');
            }
            const thing = await Thing.findById(new mongoose.Types.ObjectId(thingId)).exec();
            if (!thing) {
                throw new Error('Thing not found');
            }
            thing.attributes = thing.attributes.filter(attrId => !attrId.equals(attribute._id));
            await thing.save();
            await Attribute.deleteOne({ _id: attribute._id });
            return attributeId;
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
