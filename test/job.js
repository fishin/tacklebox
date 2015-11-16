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

describe('job', () => {

    it('POST /api/jobs/active', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/jobs/active' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.be.empty();
                done();
            });
        });
    });

    it('POST /api/job parallelcommand', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'parallelcommand',
                body: ['sleep 5', 'sleep 2']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start parallelcommand', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('parallelcommand').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const runId = response.result;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/pids' }, (response2) => {

                    expect(response2).to.exist();
                });
                const intervalObj = setInterval(() => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response3) => {

                        if (response3.result.finishTime) {
                            clearInterval(intervalObj);
                            expect(response3.result.id).to.exist();
                            expect(response3.result.finishTime).to.exist();
                            //expect(lastSuccessId).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/byname parallelcommand', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/job/byname/parallelcommand' }, (response) => {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                expect(response.result.name).to.equal('parallelcommand');
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} parallelcommand', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('parallelcommand').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job sleep5', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'sleep5',
                body: ['sleep 5']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start sleep5', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('sleep5').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const runId = response.result;
                const intervalObj = setInterval(() => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response2) => {

                        if (response2.result.finishTime) {
                            clearInterval(intervalObj);
                            //const lastSuccessId = Store.getRunByLabel(jobId, 'lastSuccess');
                            expect(response2.result.id).to.exist();
                            expect(response2.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('DELETE /api/job/{jobId}/workspace sleep5', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('sleep5').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/workspace' }, (response) => {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} sleep5', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('sleep5').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job badcmd', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'badcommand',
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

    it('PUT /api/job/{jobId} badcommand', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('badcommand').id;
            const payload = {
                name: 'badcommand',
                body: ['uptim']
            };
            server.inject({ method: 'PUT', url: '/api/job/' + jobId, payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.updateTime).to.exist();
                expect(response.result.name).to.equal('badcommand');
                expect(response.result.body).to.only.include(['uptim']);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start badcommand', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('badcommand').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const runId = response.result;
                const intervalObj = setInterval(() => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response2) => {

                        if (response2.result.finishTime) {
                            clearInterval(intervalObj);
                            //const lastSuccessId = Store.getRunByLabel(jobId, 'lastSuccess');
                            //const lastFailId = Store.getRunByLabel(jobId, 'lastFail');
                            expect(response2.result.id).to.exist();
                            expect(response2.result.finishTime).to.exist();
                            //expect(lastFailId).to.exist();
                            //expect(lastSuccessId).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId} badcommand', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('badcommand').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response) => {

                expect(response.statusCode).to.equal(200);
                //expect(response.result.status).is.equal('failed');
                expect(response.result.finishTime).to.be.above(response.result.startTime);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} badcommand', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('badcommand').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job invalidscm', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'invalidscm',
                head: ['date'],
                scm: {
                    type: 'invalid'
                },
                body: ['uptime'],
                tail: ['cat /etc/hosts']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.not.exist();
                done();
            });
        });
    });

    it('POST /api/job noscm', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'noscm',
                head: ['date'],
                body: ['uptime'],
                tail: ['cat /etc/hosts']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('POST /api/job git', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'git',
                head: ['date'],
                scm: {
                    type: 'git',
                    url: 'https://github.com/fishin/tacklebox',
                    branch: 'master'
                },
                body: ['bin/body.sh'],
                tail: ['bin/tail.sh']
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

    it('GET /api/jobs', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/jobs' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/job/{jobId} git', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start git', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const runId = response.result;
                const intervalObj = setInterval(() => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response2) => {

                        if (response2.result.finishTime) {
                            clearInterval(intervalObj);
                            //console.log(JSON.stringify(run, null, 4));
                            expect(response2.result.id).to.exist();
                            expect(response2.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{jobId}/start noscm', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('noscm').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const runId = response.result;
                const intervalObj = setInterval(() => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response2) => {

                        if (response2.result.finishTime) {
                            clearInterval(intervalObj);
                            //console.log(JSON.stringify(run, null, 4));
                            expect(response2.result.id).to.exist();
                            expect(response2.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{jobId}/start noscm labels', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('noscm').id;
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

    it('GET /api/job/{jobId}/runs', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('noscm').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/runs' }, (response) => {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId}/previous noscm', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('noscm').id;
            const runId1 = bait.getRuns(jobId)[1].id;
            const runId2 = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId2 + '/previous' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.equal(runId1);
                done();
            });
        });
    });


    it('GET /api/job/{jobId}/run/{runId} git', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('succeeded');
                expect(response.result.finishTime).to.be.above(response.result.startTime);
                expect(response.result.elapsedTime).to.exist();
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/commits', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/commits' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.length).to.above(0);
                done();
            });
        });
    });

    it('POST /api/job/{jobId}/commits/compare', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            const payload = {
                commit1: bait.getRuns(jobId)[0].commit,
                commit2: bait.getRuns(jobId)[0].commit
            };
            server.inject({ method: 'POST', url: '/api/job/' + jobId + '/commits/compare', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.length).to.equal(0);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/byname last', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/byname/last' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('succeeded');
                expect(response.result.id).to.exist();
                expect(response.result.id).to.equal(runId);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId}/run/{runId} git', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            const runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/run/' + runId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} git', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('git').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} noscm', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('noscm').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job parallelcommand cancel', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'cancel',
                body: ['sleep 5', 'sleep 2']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start cancel', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('cancel').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, (response) => {

                expect(response.statusCode).to.equal(200);
                const runId = response.result;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/cancel' }, (response2) => {

                    expect(response2).to.exist();
                });
                const intervalObj = setInterval(() => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, (response3) => {

                        if (response3.result.finishTime) {
                            clearInterval(intervalObj);
                            expect(response3.result.id).to.exist();
                            expect(response3.result.finishTime).to.exist();
                            expect(response3.result.commands).to.be.length(2);
                            expect(response3.result.commands[0].startTime).to.exist();
                            expect(response3.result.commands[1].startTime).to.not.exist();
                            expect(response3.result.status).to.equal('cancelled');
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('DELETE /api/job/{jobId}/runs cancel', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('cancel').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/runs' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} cancel', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('cancel').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
