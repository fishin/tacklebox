'use strict';

const Code = require('code');
const Lab = require('lab');
const Hapi = require('hapi');

const internals = {
    defaults: {
        user: {
            dirPath: __dirname + '/tmp/user'
        }
    }
};

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

internals.prepareServer = function (callback) {

    const server = new Hapi.Server();
    server.connection();

    server.register({

        register: require('..'),
        options: internals.defaults
    }, (err) => {

        expect(err).to.not.exist();
        callback(server);
    });
};

describe('user', () => {

    it('POST /api/password', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                password: 'password'
            };
            server.inject({ method: 'POST', url: '/api/password', payload: payload }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.equal(60);
                done();
            });
        });
    });

    it('GET /api/password/{length}', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/password/10' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.equal(10);
                done();
            });
        });
    });

    it('POST /api/user lloyd', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'lloyd',
                type: 'local',
                displayName: 'Lloyd Benson1',
                email: 'lloyd.benson@gmail.com',
                password: 'password'
            };
            server.inject({ method: 'POST', url: '/api/user', payload: payload }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('POST /api/user backer', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'backer',
                type: 'local',
                displayName: 'Ben Acker',
                email: 'ben.acker@gmail.com',
                password: 'password'
            };
            server.inject({ method: 'POST', url: '/api/user', payload: payload }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/users', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/users' }, (response) => {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/user/{id}', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/users' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const id = response.result[0].id;
                server.inject({ method: 'GET', url: '/api/user/' + id }, (response2) => {

                    //console.log(response2.result);
                    expect(response2.result.id).to.exist();
                    expect(response2.result.displayName).to.equal('Lloyd Benson1');
                    expect(response2.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('GET /api/user/byname/{name} lloyd', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/user/byname/lloyd' }, (response) => {

                expect(response.statusCode).to.equal(200);
                //console.log(response.result);
                expect(response.result.id).to.exist();
                expect(response.result.name).to.equal('lloyd');
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    it('POST /api/user/{id}/validate lloyd', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/user/byname/lloyd' }, (response) => {

                const userId = response.result.id;
                const payload = { password: 'password' };
                server.inject({ method: 'POST', url: '/api/user/' + userId + '/validate', payload: payload }, (response2) => {

                    //console.log(response2);
                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result).to.be.true();
                    done();
                });
            });
        });
    });

    it('PUT /api/user/{id}', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/users' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const id = response.result[0].id;
                const payload = { name: 'Lloyd Benson' };
                server.inject({ method: 'PUT', url: '/api/user/' + id, payload: payload }, (response2) => {

                    //console.log(response2.result);
                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.name).to.equal('Lloyd Benson');
                    done();
                });
            });
        });
    });

    it('DELETE /api/user/{id} lloyd', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/users' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                const id = response.result[0].id;
                server.inject({ method: 'DELETE', url: '/api/user/' + id }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/users' }, (response3) => {

                        expect(response3.result).to.have.length(1);
                        done();
                    });
                });
            });
        });
    });

    it('DELETE /api/user/{id} backer', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/users' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                const id = response.result[0].id;
                server.inject({ method: 'DELETE', url: '/api/user/' + id }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/users' }, (response3) => {

                        expect(response3.result).to.have.length(0);
                        done();
                    });
                });
            });
        });
    });
});
