import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
// Quando você não passa o arquivo que quer importar ele implicitamente supõe que [é o index]
import db from './models'
import schema from './graphql/schema';
import { extractJwtMiddleware } from './middlewares/extract-jwt.middleware';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
    }

    private middleware(): void {

        extractJwtMiddleware(),

        this.express.use('/graphql',
            (req, res, next) => {
                req['context'].db = db;
                next();
            },
            graphqlHTTP((req) => ({
                schema: schema,
                graphiql: true, //process.env.NODE_ENV === 'development', //for any reason my ubuntu can set env variables
                context: req['context']
            }))
        )
    }
}

export default new App().express;