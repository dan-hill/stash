export const FUSIONAUTH_PORT = '9011'
export const FUSIONAUTH_HOST = 'localhost'
export const FUSIONAUTH_URL_PREFIX = 'http://';

export const FUSIONAUTH_URL = `${FUSIONAUTH_URL_PREFIX}${FUSIONAUTH_HOST}:${FUSIONAUTH_PORT}`
export const TOKEN_URL = `${FUSIONAUTH_URL}/oauth2/token`;
export const AUTHORIZE_URL  = `${FUSIONAUTH_URL}/oauth2/authorize`;

export const INTROSPECT_URL = `${FUSIONAUTH_URL}/oauth2/introspect`;
export const USERINFO_URL = `${FUSIONAUTH_URL}/oauth2/userinfo`
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
