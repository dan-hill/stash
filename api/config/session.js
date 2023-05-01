import session from "express-session";

export default session(
    {
        secret: '1234567890',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 3600000
        }
    })