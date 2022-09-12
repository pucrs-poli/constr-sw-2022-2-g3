import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { router } from './router';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.listen(3000, () => console.log('Listening on 3000'));
