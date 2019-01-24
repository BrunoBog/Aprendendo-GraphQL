import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
// Quando você não passa o arquivo que quer importar ele implicitamente supõe que [é o index]
import db from './models'
import schema from './graphql/schema';
import { extractJwtMiddleware } from './middlewares/extract-jwt.middleware';
import { DataLoaderFactory } from './graphql/dataLoaders/dataloaderFactory';

class App {
    public express: express.Application;
    private dataLoaderFactory: DataLoaderFactory;

    constructor() {
        this.express = express();
        this.init();
    }

    private init(): void{
        this.middleware();
        this.dataLoaderFactory = new DataLoaderFactory(db);
    }

    private middleware(): void {

        this.express.use('/graphql',

            extractJwtMiddleware(),

            (req, res, next) => {
                req['context']['db'] = db;
                req['context']['dataLoaderFactory'] = this.dataLoaderFactory.getLoaders();;
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