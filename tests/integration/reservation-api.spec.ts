import chai, { expect } from 'chai';

describe('Reservations api tests', () => {
    it('Get all reservations', (done) => {
        chai.request('http://localhost:3001')
        .get('/reservations')
        .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.be.eq(200);
            expect(res.body).to.be.an('array');
            
            const item = res.body.find((item: any) => item.start_date === '2022-11-07T10:00:00.000Z');

            expect(item.id).to.be.an('string');
            expect(item.start_date).to.be.eq('2022-11-07T10:00:00.000Z');
            expect(item.end_date).to.be.eq('2022-11-07T11:00:00.000Z');
            expect(item.resource_id).to.be.eq('00000000-0000-0000-0000-000000000001');
            expect(item.active).to.be.true;
            done();
        });
    });
});
