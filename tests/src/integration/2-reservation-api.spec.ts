import chai, { expect } from 'chai';
import { before } from 'mocha';
import { devReset } from '../utils/dev-api-calls';

describe('Reservations api tests', () => {
    let createdReservationId: string;
    let authorization: string;

    before((done) => {
        devReset(done);
    });

    it('Try get all reservations without authorization', (done) => {
        chai.request('http://localhost:8083')
        .get('/reservations')
        .end((err, res) => {
            expect(res.status).to.be.eq(401);
            done();
        });
    });

    it('Should login', (done) => {
        chai.request('http://localhost:3000')
        .post('/login')
        .send({ username: 'user', password: 'pass' })
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            expect(res.body.access_token).to.be.an('string');
            authorization = res.body.access_token;
            done();
        })
    });

    it('Get all reservations', (done) => {
        chai.request('http://localhost:8083')
        .get('/reservations')
        .set('Authorization', authorization)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            expect(res.body).to.be.an('array');
            
            const item = res.body.find((item: any) => (
                item.class_id === '10000000-0000-0000-0000-000000000001'
                && item.resource_id === '00000000-0000-0000-0000-000000000001'
            ));
            expect(item.id).to.be.an('string');
            expect(item.active).to.be.true;
            expect(item.resource).to.be.an('object');
            done();
        });
    });

    it('Create reservation', (done) => {
        const createReservation = {
            class_id: '10000000-0000-0000-0000-000000000001',
            resource_id: '00000000-0000-0000-0000-000000000002',
            observation: 'Observation Test 1',
            active: true,
        };
        chai.request('http://localhost:8083')
        .post('/reservations')
        .set('Authorization', authorization)
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(201);

            expect(res.body.id).to.be.an('string');
            expect(res.body.class_id).to.be.eq(createReservation.class_id);
            expect(res.body.resource_id).to.be.eq(createReservation.resource_id);
            expect(res.body.observation).to.be.eq(createReservation.observation);
            expect(res.body.active).to.be.true;
            expect(res.body.resource).to.be.an('object');
            createdReservationId = res.body.id;
            done();
        });
    });

    it('Try to create reservation with conflict on class and resource', (done) => {
        const createReservation = {
            class_id: '10000000-0000-0000-0000-000000000001',
            resource_id: '00000000-0000-0000-0000-000000000001',
            observation: 'Observation Test Conflict Error',
            active: true,
        };
        chai.request('http://localhost:8083')
        .post('/reservations')
        .set('Authorization', authorization)
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(409);
            done();
        });
    });

    it('Try to update reservation date to conflict with another', (done) => {
        chai.request('http://localhost:8083')
        .patch('/reservations')
        .set('Authorization', authorization)
        .send({
            id: createdReservationId,
            resource_id: '00000000-0000-0000-0000-000000000001',
        })
        .end((err, res) => {
            expect(res.status).to.be.eq(409);
            done();
        });
    });

    it('Update reservation', (done) => {
        chai.request('http://localhost:8083')
        .patch('/reservations')
        .set('Authorization', authorization)
        .send({
            id: createdReservationId,
            resource_id: '00000000-0000-0000-0000-000000000003',
            observation: 'Observation Test Updated',
            active: false,
        })
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            expect(res.body.resource).to.be.an('object');
            done();
        });
    });

    it('Get reservation by id', (done) => {
        chai.request('http://localhost:8083')
        .get(`/reservations/${createdReservationId}`)
        .set('Authorization', authorization)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);

            expect(res.body.id).to.be.eq(createdReservationId);
            expect(res.body.class_id).to.be.eq('10000000-0000-0000-0000-000000000001');
            expect(res.body.resource_id).to.be.eq('00000000-0000-0000-0000-000000000003');
            expect(res.body.observation).to.be.eq('Observation Test Updated');
            expect(res.body.active).to.be.false;
            expect(res.body.resource).to.be.an('object');
            done();
        });
    });

    it('Delete reservation by id', (done) => {
        chai.request('http://localhost:8083')
        .delete(`/reservations/${createdReservationId}`)
        .set('Authorization', authorization)
        .end((err, res) => {
            expect(res.status).to.be.eq(204);
            done();
        });
    });
});
