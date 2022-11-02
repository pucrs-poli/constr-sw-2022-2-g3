import { Client } from 'pg';
import { sleep } from '../utils/functions';

export let client: Client;

export async function connectDatabase() {
    while(true) {
        try {
            client = new Client({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
            });
            await client.connect();
            break;
        } catch (err) {
            console.error('Database connect failed, retrying...', err);
            await sleep(1000);
        }
    }
    console.log('Database connected');
}
