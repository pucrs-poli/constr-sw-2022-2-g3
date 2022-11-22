import { client } from "../database";
import { CreateReservationDto, UpdateReservationDto } from "../dtos/reservations";
import { Reservation } from "../models/reservations";
import { buildSqlWhereQuery, WhereQuery } from "../utils/query-builders";
import { genUuid } from "../utils/uuid";

export type ReservationWhereQuery = WhereQuery<Reservation>;

export class ReservationsRepository {
    static async reset() {
        await this.setupDatabaseSchema();
        await this.seedDatabase();
    }

    private static async setupDatabaseSchema() {
        await client.query(`DROP TABLE IF EXISTS reservations;`);
        await client.query(
            `CREATE TABLE IF NOT EXISTS reservations (
                id varchar(256),
                class_id varchar(256),
                resource_id varchar(256),
                observation varchar(1024),
                active boolean
            );`
        );
        await client.query(`ALTER TABLE reservations ADD CONSTRAINT id_pk PRIMARY KEY (id)`);
        await client.query(`CREATE INDEX reservations_cla_id_ak on reservations (class_id);`); // Performance...
        await client.query(`CREATE INDEX reservations_res_id_ak on reservations (resource_id);`); // Performance...
    }

    private static async seedDatabase() {
        const classId1 = '10000000-0000-0000-0000-000000000001';
        const classId2 = '10000000-0000-0000-0000-000000000002';
        const resourceId1 = '00000000-0000-0000-0000-000000000001';
        await this.create({
            observation: 'Observation 1',
            class_id: classId1,
            resource_id: resourceId1,
            active: true,
        });
        await this.create({
            observation: 'Observation 2',
            class_id: classId2,
            resource_id: resourceId1,
            active: true,
        });
    }

    static async findAll(whereQuery?: ReservationWhereQuery) {
        if (whereQuery) {
            const [query, values] = buildSqlWhereQuery(whereQuery);
            console.log(query, values)
            return (await client.query<Reservation>(`SELECT * FROM reservations WHERE ${query};`, values)).rows;
        } else {
            return (await client.query<Reservation>('SELECT * FROM reservations;',)).rows;
        }
    }

    static async findById(id: string) {
        return (await client.query<Reservation>('SELECT * FROM reservations WHERE id = $1;', [id])).rows[0];
    }

    static async create(reservation: CreateReservationDto) {
        const id = genUuid();
        return (await client.query<Reservation>(
            'INSERT INTO reservations(id, class_id, resource_id, observation, active) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
            [id, reservation.class_id, reservation.resource_id, reservation.observation, reservation.active],
        )).rows[0].id;
    }

    static async update(reservation: UpdateReservationDto) {
        await client.query<Reservation>(`
            UPDATE reservations SET
            class_id = COALESCE($2, class_id),
            resource_id = COALESCE($3, resource_id),
            observation = COALESCE($4, observation),
            active = COALESCE($5, active)
            WHERE id = $1;`,
            [reservation.id, reservation.class_id, reservation.resource_id, reservation.observation, reservation.active],
        );
    }

    static async deleteById(id: string) {
        await client.query('DELETE FROM reservations WHERE id = $1;', [id]);
    }
}
