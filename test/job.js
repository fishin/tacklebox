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

describe('api', function () {

  it('POST /api/job parallelcommand', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'parallelcommand',
                body: [ 'sleep 5', 'sleep 2' ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
   });

   it('GET /api/job/{jobId}/start parallelcommand', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('parallelcommand').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/pids' }, function (pidsResponse) {

                    expect(pidsResponse).to.exist();
                });
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            //expect(lastSuccessId).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

   it('GET /api/job/byname parallelcommand', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/job/byname/parallelcommand'}, function (response) {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                expect(response.result.name).to.equal('parallelcommand');
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} parallelcommand', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('parallelcommand').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

   it('POST /api/job sleep5', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'sleep5',
                body: [ 'sleep 5' ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

// want to try to abort this
// maybe background a process that runs every 1s and tries to kill the specific command by the same user?
// generate bash script with sleep with specific name
    it('GET /api/job/{jobId}/start sleep5', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('sleep5').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastSuccessId = Store.getRunByLabel(jobId, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('DELETE /api/job/{jobId}/workspace sleep5', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('sleep5').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/workspace' }, function (response) {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} sleep5', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('sleep5').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job badcmd', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'badcommand',
                body: [ 'uptime' ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('PUT /api/job/{jobId} badcommand', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('badcommand').id;
            var payload = {
                name: 'badcommand',
                body: [ 'uptim' ]
            };
            server.inject({ method: 'PUT', url: '/api/job/' + jobId, payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.updateTime).to.exist();
                expect(response.result.name).to.equal('badcommand');
                expect(response.result.body).to.only.include([ 'uptim' ]);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start badcommand', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('badcommand').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastSuccessId = Store.getRunByLabel(jobId, 'lastSuccess');
                            //var lastFailId = Store.getRunByLabel(jobId, 'lastFail');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            //expect(lastFailId).to.exist();
                            //expect(lastSuccessId).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId} badcommand', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('badcommand').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (response) {

                expect(response.statusCode).to.equal(200);
                //expect(response.result.status).is.equal('failed');
                expect(response.result.finishTime).to.be.above(response.result.startTime);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} badcommand', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('badcommand').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job invalidscm', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'invalidscm',
                head: [ 'date' ],
                scm: {
                    type: 'invalid'
                },
                body: [ 'uptime' ],
                tail: [ 'cat /etc/hosts' ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.not.exist();
                done();
            });
        });
    });

    it('POST /api/job noscm', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'noscm',
                head: [ 'date' ],
                body: [ 'uptime' ],
                tail: [ 'cat /etc/hosts' ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('POST /api/job git', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'git',
                head: [ 'date' ],
                scm: {
                    type: 'git',
                    url: 'https://github.com/fishin/tacklebox',
                    branch: 'master'
                },
                body: [ 'bin/body.sh' ],
                tail: [ 'bin/tail.sh' ]
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

    it('GET /api/jobs', function (done) {

        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/jobs'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/job/{jobId} git', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/start git', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //console.log(JSON.stringify(run, null, 4));
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('getWorkspaceArtifact', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            var contents = bait.getWorkspaceArtifact(jobId, 'bin/tail.sh');
            expect(contents).to.contain('cat /etc/hosts');
            done();
        });
    });

    it('GET /api/job/{jobId}/start noscm', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('noscm').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //console.log(JSON.stringify(run, null, 4));
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{jobId}/start noscm labels', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('noscm').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //console.log(JSON.stringify(run, null, 4));
                            //var lastId = Store.getRunByLabel(jobId, 'last');
                            //var lastSuccessId = Store.getRunByLabel(jobId, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            //expect(response.result.runId.toString()).to.equal(lastId);
                            //expect(response.result.runId.toString()).to.equal(lastSuccessId);
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{jobId}/runs', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('noscm').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/runs'}, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/{runId} git', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('succeeded');
                expect(response.result.finishTime).to.be.above(response.result.startTime);
                expect(response.result.elapsedTime).to.exist();
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/commits', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/commits' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.length).to.above(0);
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/run/byname last', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            var runId = bait.getRuns(jobId)[0].id;
            var lastRun = bait.getRunByName(jobId, 'last');
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/byname/last'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('succeeded');
                expect(response.result.id).to.exist();
                expect(response.result.id).to.equal(runId);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId}/run/{runId} git', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            var runId = bait.getRuns(jobId)[0].id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId + '/run/' + runId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} git', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('git').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{jobId} noscm', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('noscm').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

  it('POST /api/job parallelcommand cancel', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'cancel',
                body: [ 'sleep 5', 'sleep 2' ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
   });

   it('GET /api/job/{jobId}/start cancel', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('cancel').id;
            server.inject({ method: 'GET', url: '/api/job/' + jobId + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var runId = response.result;
                server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId + '/cancel' }, function (cancelResponse) {

                    expect(cancelResponse).to.exist();
                });
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/run/' + runId }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastSuccessId = Store.getRunByLabel(jobId, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            expect(newResponse.result.commands).to.be.length(2);
                            expect(newResponse.result.commands[0].startTime).to.exist();
                            expect(newResponse.result.commands[1].startTime).to.not.exist();
                            expect(newResponse.result.status).to.equal('cancelled');
                            //expect(lastSuccessId).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('DELETE /api/job/{jobId} cancel', function (done) {

        internals.prepareServer(function (server) {

            var bait = new Bait(internals.defaults.job);
            var jobId = bait.getJobByName('cancel').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
