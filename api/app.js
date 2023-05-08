import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import db from './config/database.js';
import cors from './config/cors.js';
import session from './config/session.js'
import {getUser} from './route/user.js';
import {createToken, refreshToken} from './route/token.js';
import {createThing, getThings} from "./route/things.js";
import {errorHandler} from "./middleware/errorHandler.js";
import {THINGS_URL, TOKEN_REFRESH_URL, TOKEN_URL, USER_URL} from "./constant/urls.js";
import {buildSchema} from "graphql";
import fs from "fs";
import path from "path";
import {ApolloServer, gql} from "apollo-server-express";
import { fileURLToPath } from 'url';
import {Thing} from "./model/thing.js";
import resolvers from "./graphql/resolvers.js";
import {authenticate} from "./middleware/authenticate.js";

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors);
app.use(session);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeDefs = gql(fs.readFileSync(path.join(__dirname, '/graphql/schema.graphql'), 'utf-8'));
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return { req };
    }
});
await server.start();
server.applyMiddleware({ app });

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

app.get(USER_URL, authenticate, errorHandler(getUser));

app.post(TOKEN_URL, errorHandler(createToken));
app.post(TOKEN_REFRESH_URL, errorHandler(refreshToken));
app.get(THINGS_URL, authenticate, errorHandler(getThings) );
app.post(THINGS_URL, authenticate, errorHandler(createThing) );

// Start the server
app.listen(3555, () => {
    console.log('Server started on port 3555');
});
