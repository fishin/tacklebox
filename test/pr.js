'use strict';

const Bait = require('bait');
const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');

const internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job',
            workspace: 'workspace',
            configFile: 'config.json',
            mock: true
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

describe('pr', () => {

    it('POST /api/prs/active', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/prs/active' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.be.empty();
                done();
            });
        });
    });

    it('POST /api/job prs', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'prs',
                scm: {
                    type: 'git',
                    url: 'https://github.com/fishin/demo',
                    branch: 'master'
                },
                body: ['npm install', 'npm test']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                //console.log(response)
                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/start', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                const number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/start' }, (response2) => {

                    //console.log(response2.result);
                    expect(response2.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/runs', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                const number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, (response2) => {

                    expect(response2.result.length).to.equal(1);
                    done();
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}/pids', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                const number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(1);
                    //console.log(response2.result);
                    const runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/pids' }, (response3) => {

                        //console.log(response3);
                        expect(response3.result.length).to.equal(1);
                        expect(response3.result[0]).to.be.a.number();
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}/cancel', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                const number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(1);
                    //console.log(response2.result);
                    const runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/cancel' }, (response3) => {

                        //console.log(response3);
                        //expect(response3.result.length).to.equal(1);
                        //expect(response3.result[0]).to.be.a.number();
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                const number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, (response2) => {

                    const runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId }, (response3) => {

                        expect(response3.result.id).to.exist();
                        expect(response3.result.status).to.equal('cancelled');
                        expect(response3.result.finishTime).to.exist();
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}/previous', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                const number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, (response2) => {

                    const runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/previous' }, (response3) => {

                        expect(response3.result).to.not.exist();
                        done();
                    });
                });
            });
        });
    });

    it('DELETE /api/job/{jobId}/pr/{number}', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                const number = response.result[0].number;
                server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/pr/' + number }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('DELETE /api/job/{jobId} prs', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
