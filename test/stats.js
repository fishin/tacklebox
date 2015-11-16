'use strict';

const Bait = require('bait');
const Code = require('code');
const Lab = require('lab');
const Hapi = require('hapi');

const internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job',
            workspace: 'workspace',
            configFile: 'config.json'
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

describe('stats', () => {

    it('POST /api/job', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'runsstats',
                body: ['uptime']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const runId = response.result;
                const intervalObj = setInterval(() => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response2) => {

                        if (response2.result.finishTime) {
                            clearInterval(intervalObj);
                            expect(response2.result.id).to.exist();
                            expect(response2.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{jobId}/runs/stats', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/runs/stats' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.runs.length).to.equal(1);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/runs/stats/limit/{limit}', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/runs/stats/limit/1' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.runs.length).to.equal(1);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId}/stats', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('runsstats').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/stats' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/jobs/stats', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/jobs/stats' }, (response) => {

                expect(response.statusCode).to.equal(200);
                //console.log(response.result);
                expect(response.result).to.have.length(1);
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId}', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
