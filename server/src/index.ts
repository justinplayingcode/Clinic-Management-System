import connectDB from './helper/db.config';
import express, { json, Express  } from 'express';
import cors from 'cors';
import helmet from "helmet";
import routes from './routes';
import middlewares from './middlewares';
import { ApiStatusCode } from './common/enum/apiStatusCode';
import ErrorObject from './common/model/error';
connectDB();
const app: Express  = express();
app.use(cors());
app.use(helmet());
app.use(json());
app.use('/api', routes);
app.all('*', (req, res, next) => {
    const err: any = new ErrorObject('The route can not be found', ApiStatusCode.BadRequest, 'Duong dan sai');
    return next(err);
})
app.use(middlewares.errorHandler);
export default app;