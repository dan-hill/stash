import { AUTHORIZE_URL, CLIENT_ID, CLIENT_SECRET, FUSIONAUTH_URL, TOKEN_URL} from "../config/fusionauth.js";
import {Router} from "express";
import request from "request-promise";
import fetch from 'node-fetch';
import {APPLICATION_X_WWW_FORM_URLENCODED, CONTENT_TYPE} from "../constant/headers.js";
import {POST} from "../constant/http_method.js";

const router = Router();

export const createToken = async (req, res) => {

    const data = {
        'grant_type': 'password',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'username': req.body.email,
        'password': req.body.password,
        'scope': 'offline_access'
    }

    const form =  Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

    const response = await fetch(TOKEN_URL, {
        method: POST,
        body: form,
        headers: {
            [CONTENT_TYPE]: APPLICATION_X_WWW_FORM_URLENCODED
        }
    });

    res.send(await response.json())

}

export const refreshToken = async (req, res) => {

        const data = {
            'grant_type': 'refresh_token',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'refresh_token': req.body.refresh_token,
            'scope': 'offline_access'
        }

        const form =  Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

        const response = await fetch(TOKEN_URL, {
            method: POST,
            body: form,
            headers: {
                [CONTENT_TYPE]: APPLICATION_X_WWW_FORM_URLENCODED
            }
        });

        res.send(await response.json())

}
export default router;
