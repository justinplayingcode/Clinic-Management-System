import connectDB from './helper/db.config';
import express, { json, Express  } from 'express';
import cors from 'cors';
import helmet from "helmet";
import routes from './routes';
import middlewares from './middlewares';
import { ApiStatusCode } from './common/enum/apiStatusCode';
connectDB();
const app: Express  = express();
app.use(cors());
app.use(helmet());
app.use(json());
app.use('/api', routes);
app.all('*', (req, res, next) => {
    const err: any = new Error('The route can not be found');
    err.statusCode = ApiStatusCode.BadRequest;
    next(err)
})
app.use(middlewares.errorHandler);
export default app;