import chai, { expect } from 'chai';
import { before } from 'mocha';
import { devReset } from '../utils/dev-api-calls';

describe('Reservations api tests', () => {
    let createdReservationId: string;

    before((done) => {
        devReset(done);
    });

    it('Get all reservations', (done) => {
        chai.request('http://localhost:3001')
        .get('/reservations')
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            expect(res.body).to.be.an('array');
            
            const item = res.body.find((item: any) => item.start_date === '2022-11-07T10:00:00.000Z');
            expect(item.id).to.be.an('string');
            expect(item.end_date).to.be.eq('2022-11-07T11:00:00.000Z');
            expect(item.resource_id).to.be.eq('00000000-0000-0000-0000-000000000001');
            expect(item.active).to.be.true;
            done();
        });
    });

    it('Create reservation', (done) => {
        const createReservation = {
            start_date: '2022-10-05T10:00:00.000Z',
            end_date: '2022-10-05T11:00:00.000Z',
            resource_id: '00000000-0000-0000-0000-000000000001',
            observation: 'Obs',
            active: true,
        };
        chai.request('http://localhost:3001')
        .post('/reservations')
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);

            expect(res.body.id).to.be.an('string');
            expect(res.body.start_date).to.be.eq(createReservation.start_date);
            expect(res.body.end_date).to.be.eq(createReservation.end_date);
            expect(res.body.resource_id).to.be.eq(createReservation.resource_id);
            expect(res.body.observation).to.be.eq(createReservation.observation);
            expect(res.body.active).to.be.true;
            done();
        });
    });

    // Existent:       ------
    // Created:   ------
    it('Try to create reservation with conflict on end time', (done) => {
        const createReservation = {
            start_date: '2022-10-05T09:00:00.000Z',
            end_date: '2022-10-05T10:00:00.001Z',
            resource_id: '00000000-0000-0000-0000-000000000001',
            observation: 'Obs',
            active: true,
        };
        chai.request('http://localhost:3001')
        .post('/reservations')
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(409);
            done();
        });
    });

    // Existent:  ------
    // Created:        ------
    it('Try to create reservation with conflict on start time', (done) => {
        const createReservation = {
            start_date: '2022-10-05T10:59:59.999Z',
            end_date: '2022-10-05T12:00:00.000Z',
            resource_id: '00000000-0000-0000-0000-000000000001',
            observation: 'Obs',
            active: true,
        };
        chai.request('http://localhost:3001')
        .post('/reservations')
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(409);
            done();
        });
    });

    // Existent: -----------------
    // Created:      ---------
    it('Try to create reservation with conflict, the created reservation occurs inside start_date and end_date of another reservation', (done) => {
        const createReservation = {
            start_date: '2022-10-05T10:20:00.000Z',
            end_date: '2022-10-05T10:40:00.000Z',
            resource_id: '00000000-0000-0000-0000-000000000001',
            observation: 'Obs',
            active: true,
        };
        chai.request('http://localhost:3001')
        .post('/reservations')
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(409);
            done();
        });
    });

    // Existent:        -------
    // Created:  -------
    it('Create reservation on start_date limit of another', (done) => {
        const createReservation = {
            start_date: '2022-10-05T09:00:00.000Z',
            end_date: '2022-10-05T10:00:00.000Z',
            resource_id: '00000000-0000-0000-0000-000000000001',
            observation: 'Obs',
            active: true,
        };
        chai.request('http://localhost:3001')
        .post('/reservations')
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            createdReservationId = res.body.id;
            done();
        });
    });

    // Existent: -------
    // Created:         -------
    it('Create reservation on end_date limit of another', (done) => {
        const createReservation = {
            start_date: '2022-10-05T11:00:00.000Z',
            end_date: '2022-10-05T12:00:00.000Z',
            resource_id: '00000000-0000-0000-0000-000000000001',
            observation: 'Obs',
            active: true,
        };
        chai.request('http://localhost:3001')
        .post('/reservations')
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            done();
        });
    });


    // Existent: ----------------- (resource 1)
    // Created:      --------- (resource 2)
    it('Create reservation while another reservation exists but for another resource', (done) => {
        const createReservation = {
            start_date: '2022-10-05T10:20:00.000Z',
            end_date: '2022-10-05T10:40:00.000Z',
            resource_id: '00000000-0000-0000-0000-000000000002',
            observation: 'Obs',
            active: true,
        };
        chai.request('http://localhost:3001')
        .post('/reservations')
        .send(createReservation)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            done();
        });
    });

    it('Try to update reservation date to conflict with another', (done) => {
        chai.request('http://localhost:3001')
        .patch('/reservations')
        .send({
            id: createdReservationId,
            start_date: '2022-10-05T09:00:00.000Z',
            end_date: '2022-10-05T10:10:00.000Z', // Conflict with reservation of [10:00:00, 11:00:00)
        })
        .end((err, res) => {
            expect(res.status).to.be.eq(409);
            done();
        });
    });

    it('Update reservation', (done) => {
        chai.request('http://localhost:3001')
        .patch('/reservations')
        .send({
            id: createdReservationId,
            end_date: '2022-10-05T09:50:00.000Z',
            active: false,
        })
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            done();
        });
    });

    it('Get reservation by id', (done) => {
        chai.request('http://localhost:3001')
        .get(`/reservations/${createdReservationId}`)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);

            expect(res.body.id).to.be.eq(createdReservationId);
            expect(res.body.start_date).to.be.eq('2022-10-05T09:00:00.000Z');
            expect(res.body.end_date).to.be.eq('2022-10-05T09:50:00.000Z');
            expect(res.body.resource_id).to.be.eq('00000000-0000-0000-0000-000000000001');
            expect(res.body.observation).to.be.eq('Obs');
            expect(res.body.active).to.be.false;
            done();
        });
    });

    it('Get reservation status by resource and time (should be RESERVED)', (done) => {
        chai.request('http://localhost:3001')
        .get(`/reservations/resource/00000000-0000-0000-0000-000000000001/status?time=${new Date('2022-10-05T10:00:00.000Z').getTime()}`)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);

            expect(res.body.status).to.be.eq('RESERVED');
            done();
        });
    });

    it('Get reservation status by resource and time (should be FREE)', (done) => {
        chai.request('http://localhost:3001')
        .get(`/reservations/resource/00000000-0000-0000-0000-000000000001/status?time=${new Date('2022-10-05T05:00:00.000Z').getTime()}`)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);

            expect(res.body.status).to.be.eq('FREE');
            done();
        });
    });

    it('Get reservation status by resource and time (should be INACTIVE)', (done) => {
        chai.request('http://localhost:3001')
        .get(`/reservations/resource/00000000-0000-0000-0000-000000000001/status?time=${new Date('2022-10-05T09:00:00.000Z').getTime()}`)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);

            expect(res.body.status).to.be.eq('INACTIVE');
            done();
        });
    });
    
});
