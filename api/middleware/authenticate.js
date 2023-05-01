import request from "request-promise";
import {CLIENT_ID, CLIENT_SECRET, INTROSPECT_URL} from "../config/fusionauth.js";
import {MISSING_TOKEN} from "../constant/error_reasons.js";

export async function authenticate(req, res, next) {
    try {
        const response = await request.post({
            url: INTROSPECT_URL,
            form: {
                token: req.header('x-requested-with'),
                client_id: CLIENT_ID
            },
            headers: {
                'Authorization': 'Bearer ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            }
        });

        const { active, sub } = JSON.parse(response);
        if (active) {
            req.userId = sub;
            return next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }

    } catch (err) {
        switch (JSON.parse(err.error).error_reason) {
            case MISSING_TOKEN: return res.status(401).json({ error: 'Unauthorized' });
            default: return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}