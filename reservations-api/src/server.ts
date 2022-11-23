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

const port = parseInt(process.env.PORT || '8083');

const app = express();
RegisterLogger(app);
RegisterParsers(app);
RegisterSwagger(app);
RegisterRoutes(app);
RegisterErrorHandler(app);
connectDatabase().then(() => {
    ReservationsRepository.reset();
});
const server = app.listen(port, () => console.log(`Listening on ${port}`));

// Cleanup routines
const shutdown = () => server.close();
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
