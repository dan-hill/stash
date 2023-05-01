import {
    USERINFO_URL
} from "../config/fusionauth.js";
import {Router} from "express";
import fetch from "node-fetch";
import {CREATED, OK} from "../constant/http_code.js";
import {AUTHORIZATION, BEARER, X_REQUESTED_WITH} from "../constant/headers.js";

const router = Router();

 export const getUser = async (req, res) => {

        const userInfoResponse = await (await fetch(USERINFO_URL, {
            method: 'get',
            headers: {
                [AUTHORIZATION]: BEARER + req.header(X_REQUESTED_WITH)
            }
        })).json();

        res.status(OK).json({ ...userInfoResponse })
}

export default router;
