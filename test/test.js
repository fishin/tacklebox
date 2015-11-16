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

describe('test', () => {

    it('POST /api/job', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'test',
                archive: {
                    pattern: 'test.lab'
                },
                scm: {
                    type: 'git',
                    url: 'https://github.com/fishin/pail',
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

    it('GET /api/job/{jobId}/start', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('test').id;
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

    it('GET /api/job/{jobId}/run/{runId}/test', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('test').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/test' }, (response) => {

                //console.log(response.result);
                expect(response.result.totalTests).to.exist();
                expect(response.result.tests).to.exist();
                expect(response.result.coveragePercent).to.exist();
                expect(response.result.coverage).to.exist();
                expect(response.result.totalDuration).to.exist();
                expect(response.result.totalLeaks).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId}/archive/{artifact}', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('test').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/archive/test.lab' }, (response) => {

                //console.log(response.result);
                expect(response.result).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId}/archive', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('test').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/archive' }, (response) => {

                //console.log(response.result);
                expect(response.result[0]).to.equal('test.lab');
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId}', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('test').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
