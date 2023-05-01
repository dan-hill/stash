const resolvers = {
    Query: {
        thing: async (parent, args, context, info) => {
            const { Thing } = context;
            const { id } = args;
            const thing = await Thing.findById(id);
            return thing;
        },
        things: async (parent, args, context, info) => {
            const { Thing } = context;
            const things = await Thing.find();
            return things;
        }
    },
    Mutation: {
        createThing: async (parent, args, context, info) => {
            const { Thing } = context;
            const { input } = args;
            const newThing = new Thing(input);
            await newThing.save();
            return newThing;
        },
        updateThing: async (parent, args, context, info) => {
            const { Thing } = context;
            const { id, input } = args;
            const updatedThing = await Thing.findByIdAndUpdate(id, input, { new: true });
            return updatedThing;
        },
        deleteThing: async (parent, args, context, info) => {
            const { Thing } = context;
            const { id } = args;
            const deletedThing = await Thing.findByIdAndDelete(id);
            return deletedThing;
        }
    },
    Instance: {
        thing: async (parent, args, context, info) => {
            const { Thing } = context;
            const relatedThing = await Thing.findById(parent.thing);
            return relatedThing;
        }
    }
};
export default resolvers;