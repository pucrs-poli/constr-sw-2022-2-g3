import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { RegisterRoutes } from '../build/routes';
import { connectDatabase } from './database';
import { RegisterErrorHandler } from './middlewares/error-handler';
import { RegisterLogger } from './middlewares/logger';
import { RegisterParsers } from './middlewares/parsers';
import { RegisterSwagger } from './middlewares/swagger';
import { ReservationsRepository } from './repositories/reservations-repository';

const app = express();
RegisterLogger(app);
RegisterParsers(app);
RegisterSwagger(app);
RegisterRoutes(app);
RegisterErrorHandler(app);
app.listen(3001, () => console.log('Listening on 3001'));
connectDatabase().then(() => {
    ReservationsRepository.setup();
});
