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

describe('test', function () {

    it('POST /api/job', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
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
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                //console.log(response)
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
            var jobId = bait.getJobByName('test').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start' }, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                console.log('runId:' + runId);
                var intervalObj = setInterval(function () {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (response2) {

                        console.log(response2.result); 
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

    it('GET /api/job/{jobId}/run/{runId}/test/test.lab', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('test').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/test/test.lab' }, function (response) {

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

    it('GET /api/job/{jobId}/run/{runId}/archive/{artifact}', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('test').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/archive/test.lab' }, function (response) {

                //console.log(response.result);
                expect(response.result).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId}/archive', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('test').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/archive' }, function (response) {

                //console.log(response.result);
                expect(response.result[0]).to.equal('test.lab');
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId}', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('test').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
