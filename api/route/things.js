import { Thing } from "../model/thing.js";
import {
    CONFLICT,
    CREATED,
    NOT_FOUND,
    OK,
} from "../constant/http_code.js";
import {
    THING_NOT_FOUND,
    THING_ALREADY_EXISTS,
} from "../constant/error_messages.js";

export const createThing = async (req, res) => {
    let thing = new Thing({ ...req.body, user: req.userId });
    if (await Thing.exists(thing)) {
        return res.status(CONFLICT).json({ error: THING_ALREADY_EXISTS });
    }

    await thing.save();

    return res.status(CREATED).json(thing);
};

export const getThings = async (req, res) => {
    const thing = await Thing.find({ user: req.userId });
    return res.status(OK).json(thing);
};

export const getThingById = async (req, res) => {
    let thing = await Thing.findOne({ _id: req.params.id, user: req.userId });

    if (!thing) {
        return res.status(NOT_FOUND).json({ error: THING_NOT_FOUND });
    }

    return res.status(OK).json(thing);
};

export const updateThingById = async (req, res) => {
    const thing = await Thing.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true }
    );

    if (!thing) {
        return res.status(NOT_FOUND).json({ error: THING_NOT_FOUND });
    }

    return res.status(OK).json(thing);
};