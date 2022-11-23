import chai, { expect } from 'chai';
import { sleep } from '../utils/functions';

describe('Keycloak api tests', () => {
    let authorization: string;
    let testUserId: string;

    const extractTestUser = (fn: (success: boolean) => void) => {
        chai.request('http://localhost:3000')
        .get('/users')
        .set('Authorization', authorization)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            expect(res.body).to.be.an('array');
            const user = res.body.find((user: any) => user.username === 'user');
            if (user) {
                testUserId = user.id;
                fn(true);
            } else {
                fn(false);
            }
        });
    }

    it('Login as admin', function (done) {
        console.log('Trying to login...');
        this.retries(50);
        chai.request('http://localhost:3000')
        .post('/login')
        .send({
            username: 'admin',
            password: 'a12345678',
            realm: 'master',
            client_id: 'admin-cli'
        })
        .timeout(500)
        .end(async (err, res) => {
            try {
                await sleep(1000);
                expect(res.status).to.be.eq(200);
                authorization = res.body.access_token;
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('Create test user if not exists', (done) => {
        extractTestUser(success => {
            if (!success) {
                chai.request('http://localhost:3000')
                .post('/users')
                .send({
                    username: 'user',
                    email: 'user@mail.com',
                    groups: ['/coordenadores'],
                    enabled: true,
                })
                .set('Authorization', authorization)
                .end((err, res) => {
                    expect(res.status).to.be.eq(201);
                    extractTestUser(success => {
                        if (success) {
                            done();
                        } else {
                            done(new Error('Test user was not created!'));
                        }
                    });
                });
            } else {
                done();
            }
        });
    });

    it('Update test user password', (done) => {
        chai.request('http://localhost:3000')
        .patch(`/users/${testUserId}`)
        .send({
            password: 'pass',
        })
        .set('Authorization', authorization)
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            done();
        });
    });
    
});
