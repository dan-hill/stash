import fetch from "node-fetch";

import {CLIENT_ID, CLIENT_SECRET, INTROSPECT_URL, USERINFO_URL} from "../config/fusionauth.js";

import {AUTHORIZATION, BEARER, X_REQUESTED_WITH} from "../constant/headers.js";
import request from "request-promise";
import req from "express/lib/request.js";


export async function introspectToken(token) {
    try {
        const response = await request.post({
            url: INTROSPECT_URL,
            form: {
                token: token,
                client_id: CLIENT_ID
            },
            headers: {
                'Authorization': 'Bearer ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            }
        });

        if (response) {
            const { active, sub } = JSON.parse(response);
            return { active, userId: sub };
        } else {
            return { active: false };
        }
    } catch (err) {
        console.error('Error in introspectToken:', err);
        return { active: false };
    }
}

export async function authenticate(context) {
    const res = await introspectToken(context.req.header(X_REQUESTED_WITH));
    if (res.active) {
        return res.userId;
    } else {
        throw new Error('Unauthorized');
    }
}

export async function getUser(context) {
    try {
        const userInfoResponse = await fetch(USERINFO_URL, {
            method: 'GET',
            headers: {
                [AUTHORIZATION]: BEARER + context.req.header(X_REQUESTED_WITH),
            },
        });
        if (userInfoResponse.status === 200) {
            const userInfo = await userInfoResponse.json();
            return { ...userInfo };
        } else {
            throw new Error('Internal Server Error');
        }
    } catch (err) {
        console.error('Error in getUser:', err);
        throw new Error('Internal Server Error');
    }
}


