import chai, { expect } from 'chai';

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

    it('Login as admin', (done) => {
        chai.request('http://localhost:3000')
        .post('/login')
        .send({
            username: 'admin',
            password: 'a12345678',
            realm: 'master',
            client_id: 'admin-cli'
        })
        .end((err, res) => {
            expect(res.status).to.be.eq(200);
            authorization = res.body.access_token;
            done();
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
