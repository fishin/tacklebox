var Bait = require('bait');
var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Mock = require('mock');

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

var internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};


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

describe('queue', function () {

    it('POST /api/job queue', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'queue',
                body: ['date']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/queue', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/queue' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.equal(0);
                done();
            });
        });
    });

    it('POST /api/queue', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('queue').id;
            var payload = {
                jobId: jobId
            };
            server.inject({ method: 'POST', url: '/api/queue', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                server.inject({ method: 'GET', url: '/api/queue' }, function (response2) {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(1);
                    expect(response2.result[0].jobId).to.equal(jobId);
                    done();
                });
            });
        });
    });

    it('DELETE /api/queue/{jobId}', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('queue').id;
            server.inject({ method: 'DELETE', url: '/api/queue/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                server.inject({ method: 'GET', url: '/api/queue' }, function (response2) {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(0);
                    done();
                });
            });
        });
    });

    it('DELETE /api/job/{jobId} queue', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('queue').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/queue', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'DELETE', url: '/api/queue' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
