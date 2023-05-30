import { Instance } from "../model/instance.js";
import { Source } from "../model/source.js";
import { Attribute } from "../model/attribute.js";
import {ObjectId} from "./object-id.scalar.js";
import {deleteThing, findThing, findThings, updateThing} from "./thing.resolver.js";
import {createThing} from "../route/things.js";
import {createInstance, deleteInstance, findInstances, updateInstance} from "./instance.resolver.js";
import {createAttribute, deleteAttribute, findAttributes, updateAttribute} from "./attribute.resolver.js";
import {createSource, deleteSource, findSources, updateSource} from "./source.resolver.js";
import {findMe, findUser} from "./user.resolver.js";
import {createCategory, deleteCategory, findCategories, findCategory, updateCategory} from "./category.resolver.js";
import {Category} from "../model/category.js";


const resolvers = {
    ObjectId,
    Query: {
        thing: findThing,
        things: findThings,
        category: findCategory,
        categories: findCategories,
        instances: findInstances,
        sources: findSources,
        attributes: findAttributes,
        user: findUser,
        me: findMe,
    },
    Mutation: {
        createThing: createThing,
        deleteThing: deleteThing,
        updateThing: updateThing,

        createCategory: createCategory,
        updateCategory: updateCategory,
        deleteCategory: deleteCategory,

        createSource: createSource,
        updateSource: updateSource,
        deleteSource: deleteSource,

        createAttribute: createAttribute,
        updateAttribute: updateAttribute,
        deleteAttribute: deleteAttribute,

        createInstance: createInstance,
        updateInstance: updateInstance,
        deleteInstance: deleteInstance,


    },
    Thing: {
        attributes: async (parent) => await Attribute.find({ _id: { $in: parent.attributes } }),
        sources: async (parent) => await Source.find({ _id: { $in: parent.sources } }),
        instances: async (parent) => await Instance.find({ _id: { $in: parent.instances } }),
        category: async (parent) => await Category.findById(parent.category),
    },
    Instance: {
        instance: async (parent) => await Instance.findById(parent.instance)
    },
    Category: {
        children: async (parent) => await Category.find({ _id: { $in: parent.children } }),
    }
};

export default resolvers;
