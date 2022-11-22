import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { RegisterRoutes } from '../build/routes';
import { RegisterErrorHandler } from './middlewares/error-handler';
import { RegisterLogger } from './middlewares/logger';
import { RegisterParsers } from './middlewares/parsers';
import { RegisterSwagger } from './middlewares/swagger';

const port = parseInt(process.env.PORT || '3000');

const app = express();
RegisterLogger(app);
RegisterParsers(app);
RegisterSwagger(app);
RegisterRoutes(app);
RegisterErrorHandler(app);
app.listen(port, () => console.log(`Listening on ${port}`));
