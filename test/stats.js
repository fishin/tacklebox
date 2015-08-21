var Bait = require('bait');
var Code = require('code');
var Lab = require('lab');
var Hapi = require('hapi');

var internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

internals.prepareServer = function (callback) {

    var server = new Hapi.Server();
    server.connection();

    server.register({

        register: require('..'),
        options: internals.defaults
    }, function (err) {

        expect(err).to.not.exist();
        callback(server);
    });
};

describe('stats', function () {

    it('POST /api/job', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'runsstats',
                body: ['uptime']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                var intervalObj = setInterval(function () {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (response2) {

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

    it('GET /api/job/{jobId}/runs/stats', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/runs/stats' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.runs.length).to.equal(1);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/runs/stats/limit/{limit}', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/runs/stats/limit/1' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.runs.length).to.equal(1);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId}/stats', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('runsstats').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/stats' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId}', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('runsstats').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
