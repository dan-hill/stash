import { Thing } from "../model/thing.js";
import { Instance } from "../model/instance.js";
import { Source } from "../model/source.js";
import { Attribute } from "../model/attribute.js";

const resolvers = {
    Query: {
        things: async () => {
           const things = await Thing.find()
            console.log(things);
           return things;
        },
        instances: async () => Instance.find(),
        sources: async () => Source.find(),
        attributes: async () => Attribute.find()
    },
    Mutation: {
        createThing: async (_, { input }) => Thing.create(input),
        createInstance: async (_, { input }) => Instance.create(input),
        createSource: async (_, { input }) => Source.create(input),
        createAttribute: async (_, { input }) => Attribute.create(input)
    },
    Thing: {
        attributes: async (parent) => Attribute.find({ _id: { $in: parent.attributes } }),
        sources: async (parent) => Source.find({ _id: { $in: parent.sources } }),
        instances: async (parent) => Instance.find({ _id: { $in: parent.instances } }),
    },
    Instance: {
        thing: async (parent) => Thing.findById(parent.thing)
    }
};

export default resolvers;
