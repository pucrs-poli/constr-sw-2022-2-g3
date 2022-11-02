import { client } from "../database";
import { CreateReservationDto } from "../dtos/reservations";
import { Reservation, ReservationStatus } from "../models/reservations";

export class ReservationsRepository {
    static async setup() {
        await client.query(`DROP TABLE IF EXISTS reservations;`);
        await client.query(`DROP TYPE IF EXISTS reservations_status;`);
        await client.query(`CREATE TYPE reservations_status as enum('BUSY', 'FREE');`);
        await client.query(
            `CREATE TABLE IF NOT EXISTS reservations (
                id SERIAL,
                start_date timestamp with time zone,
                end_date timestamp with time zone,
                status reservations_status,
                observation varchar(1024)
            );`
        );
        await client.query(`ALTER TABLE reservations ADD CONSTRAINT id_pk PRIMARY KEY (id)`);

        await this.create({
            end_date: new Date(),
            start_date: new Date(),
            observation: 'Observation',
            status: ReservationStatus.Busy,
        });
    }

    static async findAll() {
        return (await client.query<Reservation>('SELECT * FROM reservations;')).rows;
    }

    static async findById(id: number) {
        return (await client.query<Reservation>('SELECT * FROM reservations WHERE id = $1;', [id])).rows[0];
    }

    static async create(reservation: CreateReservationDto) {
        return (await client.query<Reservation>(
            'INSERT INTO reservations(start_date, end_date, status, observation) VALUES ($1, $2, $3, $4) RETURNING id;',
            [reservation.start_date, reservation.end_date, reservation.status, reservation.observation],
        )).rows[0].id;
    }

    static async deleteById(id: number) {
        await client.query('DELETE FROM reservations WHERE id = $1;', [id]);
    }
}
