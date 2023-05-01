import {OK} from "../constant/http_code.js";

export const errorHandler = (handler) => async (req, res, next) => {
    try {
        await handler(req, res, next);
    } catch (e) {
        return res.status(OK).json({ error: e });
    }
};
