import { client } from "../database";
import { CreateReservationDto, UpdateReservationDto } from "../dtos/reservations";
import { Reservation } from "../models/reservations";
import { genUuid } from "../utils/uuid";

export class ReservationsRepository {
    static async setup() {
        await this.setupDatabaseSchema();
        await this.seedDatabase();
    }

    private static async setupDatabaseSchema() {
        await client.query(`DROP TABLE IF EXISTS reservations;`);
        await client.query(
            `CREATE TABLE IF NOT EXISTS reservations (
                id varchar(256),
                start_date timestamp,
                end_date timestamp,
                resource_id varchar(256),
                observation varchar(1024),
                active boolean
            );`
        );
        await client.query(`ALTER TABLE reservations ADD CONSTRAINT id_pk PRIMARY KEY (id)`);
        await client.query(`CREATE INDEX reservations_res_id_ak on reservations (resource_id);`); // Performance...
    }

    private static async seedDatabase() {
        const resourceId1 = '00000000-0000-0000-0000-000000000001';
        await this.create({
            start_date: new Date('2022-11-07T10:00:00.000Z'), // Timestamp: 1667815200000
            end_date: new Date('2022-11-07T11:00:00.000Z'),
            observation: 'Observation 1',
            resource_id: resourceId1,
            active: true,
        });
        await this.create({
            start_date: new Date('2022-11-07T14:00:00.000Z'), // Timestamp: 1667829600000
            end_date: new Date('2022-11-07T15:00:00.000Z'),
            observation: 'Observation 2',
            resource_id: resourceId1,
            active: true,
        });
    }

    static async findAll() {
        return (await client.query<Reservation>('SELECT * FROM reservations;')).rows;
    }

    static async findById(id: string) {
        return (await client.query<Reservation>('SELECT * FROM reservations WHERE id = $1;', [id])).rows[0];
    }

    static async create(reservation: CreateReservationDto) {
        const id = genUuid();
        return (await client.query<Reservation>(
            'INSERT INTO reservations(id, start_date, end_date, resource_id, observation, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
            [id, reservation.start_date, reservation.end_date, reservation.resource_id, reservation.observation, reservation.active],
        )).rows[0].id;
    }

    static async update(reservation: UpdateReservationDto) {
        await client.query<Reservation>(`
            UPDATE reservations SET
            start_date = COALESCE($2, start_date),
            end_date = COALESCE($3, end_date),
            resource_id = COALESCE($4, resource_id),
            observation = COALESCE($5, observation),
            active = COALESCE($6, active)
            WHERE id = $1;`,
            [reservation.id, reservation.start_date, reservation.end_date, reservation.resource_id, reservation.observation, reservation.active],
        );
    }

    static async deleteById(id: string) {
        await client.query('DELETE FROM reservations WHERE id = $1;', [id]);
    }

    static async getByResourceIdAndTime(resourceId: string, date: Date) {
        return (await client.query<Reservation>(
            'SELECT * FROM reservations WHERE resource_id = $1 and start_date <= $2 and end_date > $2;',
            [resourceId, date]
        )).rows[0];
    }

    static async getByResourceIdAndTimeRange(resourceId: string, startDate: Date, endDate: Date, excludeId?: string) {
        return (await client.query<Reservation>(`
            SELECT * FROM reservations
            WHERE resource_id = $1 and id != $4 and (
                   (start_date < $3 and start_date >= $2)
                or (end_date > $2 and end_date < $3)
                or (start_date <= $2 and end_date >= $3)
            );`,
            [resourceId, startDate, endDate, excludeId || '']
        )).rows[0];
    }
}
