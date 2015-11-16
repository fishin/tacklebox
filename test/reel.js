'use strict';

const Code = require('code');
const Lab = require('lab');
const Hapi = require('hapi');

const internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job'
        },
        reel: {
            dirPath: __dirname + '/tmp/reel'
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

describe('reel', () => {

    it('POST /api/reel reel1', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'reel1',
                host: 'localhost',
                port: 8081,
                size: 4
            };
            server.inject({ method: 'POST', url: '/api/reel', payload: payload }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('POST /api/reel reel2', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'reel2',
                host: 'localhost',
                port: 8082,
                size: 4
            };
            server.inject({ method: 'POST', url: '/api/reel', payload: payload }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });


    it('GET /api/reel/byname reel1', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/reel/byname/reel1' }, (response) => {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                expect(response.result.name).to.equal('reel1');
                done();
            });
        });
    });

    it('GET /api/reels', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/reels' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/reel/{id}', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/reels' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                const id = response.result[0].id;
                server.inject({ method: 'GET', url: '/api/reel/' + id }, (response2) => {

                    //console.log(response2.result);
                    expect(response2.result.id).to.exist();
                    expect(response2.result.size).to.equal(4);
                    expect(response2.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('PUT /api/reel/{id}', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/reels' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                const id = response.result[0].id;
                const payload = { size: 5 };
                server.inject({ method: 'PUT', url: '/api/reel/' + id, payload: payload }, (response2) => {

                    //console.log(response2.result);
                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.size).to.equal(5);
                    done();
                });
            });
        });
    });

    it('DELETE /api/reel/{id} reel1', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/reels' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                const id = response.result[0].id;
                server.inject({ method: 'DELETE', url: '/api/reel/' + id }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/reels' }, (response3) => {

                        expect(response3.result).to.have.length(1);
                        done();
                    });
                });
            });
        });
    });

    it('DELETE /api/reel/{id} reel2', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/reels' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                const id = response.result[0].id;
                server.inject({ method: 'DELETE', url: '/api/reel/' + id }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/reels' }, (response3) => {

                        expect(response3.result).to.have.length(0);
                        done();
                    });
                });
            });
        });
    });

});
