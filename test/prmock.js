var Bait = require('bait');
var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Mock = require('mock');

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

describe('pr mock', function () {

    it('POST /api/job prs', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'prs',
                scm: {
                    type: 'git',
                    url: 'https://github.com/org/repo',
                    branch: 'master'
                },
                body: [ 'npm install', 'npm test' ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/prs', function (done) {

        var type = 'github';
        var routes = [
            {
                method: 'get',
                path: '/repos/org/repo/pulls',
                file: 'index.json'
            },
            {
                method: 'get',
                path: '/rate_limit',
                file: 'anonymous.json'
            }
        ];
        Mock.prepareServer(type, routes, function (mockServer) {

            mockServer.start(function () {

                internals.defaults.job.github = {
                    url: mockServer.info.uri
                };
                var bait = new Bait(internals.defaults.job);
                var jobId = bait.getJobByName('prs').id;
                internals.prepareServer(function (server) {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, function (response) {

                        //console.log(response.result);
                        expect(response.statusCode).to.equal(200);
                        expect(response.result.length).to.be.above(0);
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}', function (done) {

        var type = 'github';
        var routes = [
            {
                method: 'get',
                path: '/repos/org/repo/pulls/1',
                file: 'index.json'
            },
            {
                method: 'get',
                path: '/rate_limit',
                file: 'anonymous.json'
            }
        ];
        Mock.prepareServer(type, routes, function (mockServer) {

            mockServer.start(function () {

                internals.defaults.job.github = {
                    url: mockServer.info.uri
                };
                internals.prepareServer(function (server) {

                    var bait = new Bait(internals.defaults.job);
                    var jobId = bait.getJobByName('prs').id;
                    var number = 1;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number }, function (response) {

                        expect(response.statusCode).to.equal(200);
                        expect(response.result.commit).to.exist();
                        expect(response.result.number).to.exist();
                        done();
                    });
                });
            });
        });
    });
/*

    it('GET /api/job/{jobId}/pr/{number}/start', function (done) {

        var type = 'github';
        var routes = [
            {
                method: 'get',
                path: '/repos/org/repo/pulls/1',
                file: 'index.json'
            },
            {
                method: 'get',
                path: '/rate_limit',
                file: 'anonymous.json'
            }
        ];
        Mock.prepareServer(type, routes, function (mockServer) {

            mockServer.start(function () {

                internals.defaults.job.github = {
                    url: mockServer.info.uri
                };
                internals.prepareServer(function (server) {

                    var bait = new Bait(internals.defaults.job);
                    var jobId = bait.getJobByName('prs').id;
                    var number = 1;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/start' }, function (response) {

                        console.log(response.result);
                        expect(response.statusCode).to.equal(200);
                        done();
                    });
                });
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
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/start' }, function (response) {

                    //console.log(response.result);
                    expect(response.statusCode).to.equal(200);
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
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response) {

                    expect(response.result.length).to.equal(1);
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
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response) {

                    expect(response.statusCode).to.equal(200);
                    expect(response.result.length).to.equal(1);
                    //console.log(response.result);
                    var runId = response.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/pids' }, function (newResponse) {

                        //console.log(newResponse);
                        expect(newResponse.result.length).to.equal(1);
                        expect(newResponse.result[0]).to.be.a.number();
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
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response) {

                    expect(response.statusCode).to.equal(200);
                    expect(response.result.length).to.equal(1);
                    //console.log(response.result);
                    var runId = response.result[0].id;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId + '/cancel' }, function (newResponse) {

                        //console.log(newResponse);
                        //expect(newResponse.result.length).to.equal(1);
                        //expect(newResponse.result[0]).to.be.a.number();
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
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/runs' }, function (response) {

                    var runId = response.result[0].id;
                    var intervalObj = setInterval(function () {

                        server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/run/' + runId }, function (newResponse) {

                            if (newResponse.result.finishTime) {
                                clearInterval(intervalObj);
                                expect(newResponse.result.id).to.exist();
                                expect(newResponse.result.status).to.equal('cancelled');
                                expect(newResponse.result.finishTime).to.exist();
                                done();
                            }
                        });
                    }, 1000);
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
                server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/pr/' + number }, function (response) {

                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

*/

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
