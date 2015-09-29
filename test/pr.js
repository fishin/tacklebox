var Bait = require('bait');
var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');

var internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job',
            workspace: 'workspace',
            configFile: 'config.json',
            mock: true
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

describe('pr', function () {

    it('POST /api/prs/active', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/prs/active' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.be.empty();
                done();
            });
        });
    });

    it('POST /api/job prs', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'prs',
                scm: {
                    type: 'git',
                    url: 'https://github.com/fishin/demo',
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

    it('GET /api/job/{jobId}/pr/{number}/start', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                var number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/start' }, function (response2) {

                    //console.log(response2.result);
                    expect(response2.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/runs', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                var number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response2) {

                    expect(response2.result.length).to.equal(1);
                    done();
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}/pids', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                var number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response2) {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(1);
                    //console.log(response2.result);
                    var runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/pids' }, function (response3) {

                        //console.log(response3);
                        expect(response3.result.length).to.equal(1);
                        expect(response3.result[0]).to.be.a.number();
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}/cancel', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                var number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response2) {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.length).to.equal(1);
                    //console.log(response2.result);
                    var runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/cancel' }, function (response3) {

                        //console.log(response3);
                        //expect(response3.result.length).to.equal(1);
                        //expect(response3.result[0]).to.be.a.number();
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                var number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response2) {

                    var runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId }, function (response3) {

                        expect(response3.result.id).to.exist();
                        expect(response3.result.status).to.equal('cancelled');
                        expect(response3.result.finishTime).to.exist();
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/run/{runId}/previous', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                var number = response.result[0].number;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response2) {

                    var runId = response2.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/previous' }, function (response3) {

                        expect(response3.result).to.not.exist();
                        done();
                    });
                });
            });
        });
    });

    it('DELETE /api/job/{jobId}/pr/{number}', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.be.above(0);
                var number = response.result[0].number;
                server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/pr/' + number }, function (response2) {

                    expect(response2.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('DELETE /api/job/{jobId} prs', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
