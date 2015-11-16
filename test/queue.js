'use strict';

const Bait = require('bait');
const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

const internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};


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

describe('queue', () => {

    it('POST /api/job queue', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'queue',
                body: ['date']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/queue', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'GET', url: '/api/queue' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.equal(0);
                done();
            });
        });
    });

    it('POST /api/queue', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('queue').id;
            const payload = {
                jobId: jobId
            };
            server.inject({ method: 'POST', url: '/api/queue', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                server.inject({ method: 'GET', url: '/api/queue' }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(1);
                    expect(response2.result[0].jobId).to.equal(jobId);
                    done();
                });
            });
        });
    });

    it('DELETE /api/queue/{jobId}', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('queue').id;
            server.inject({ method: 'DELETE', url: '/api/queue/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                server.inject({ method: 'GET', url: '/api/queue' }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(0);
                    done();
                });
            });
        });
    });

    it('DELETE /api/job/{jobId} queue', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('queue').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/queue', (done) => {

        internals.prepareServer((server) => {

            server.inject({ method: 'DELETE', url: '/api/queue' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
