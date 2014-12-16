var Code = require('code');
var Lab = require('lab');
var Hapi = require('hapi');
var Pail = require('pail');

var internals = {
    defaults: {
        job: {
            dirpath: '/tmp/testtacklebox/job',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        run: {
//            dirpath: '/tmp/testtacklebox/run',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        reel: {
            dirpath: '/tmp/testtacklebox/reel',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        user: {
            dirpath: '/tmp/testtacklebox/user',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};

var jobPail = new Pail(internals.defaults.job);

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

   it('GET /api/job/{job_id}/start parallelcommand', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('parallelcommand');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id + '/pids' }, function (pidsResponse) {

                    expect(pidsResponse).to.exist();
                });
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            //expect(lastSuccess_id).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

   it('GET /api/job/bylink parallelcommand', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/job/bylink/parallelcommand'}, function (response) {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                expect(response.result.name).to.equal('parallelcommand');
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} parallelcommand', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('parallelcommand');
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
/*
   it('POST /api/job missingcommand', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'missingcommand'
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.job_id).to.not.exist();
                expect(response.result.err).to.exist();
                done();
            });
        });
   });

*/

   it('POST /api/job sleep5', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'sleep5',
                body: 'sleep 5'
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
    it('GET /api/job/{job_id}/start sleep5', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('sleep5');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('DELETE /api/job/{job_id} sleep5', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('sleep5');
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job badcmd', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'badcmd',
                body: 'uptime'
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('PUT /api/job/{job_id} badcommand', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('badcmd');
            var payload = { name: 'badcommand', command: 'uptim' };
            server.inject({ method: 'PUT', url: '/api/job/'+ job_id, payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.updateTime).to.exist();
                expect(response.result.name).to.equal('badcommand');
                expect(response.result.command).to.equal('uptim');
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/start badcommand', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('badcommand');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                            //var lastFail_id = Store.getRunByLabel(job_id, 'lastFail');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            //expect(lastFail_id).to.exist();
                            //expect(lastSuccess_id).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id} badcommand', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('badcommand');
            var run_id = server.plugins.tacklebox.getRuns(job_id)[0].id;
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                //expect(response.result.status).is.equal('failed');
                expect(response.result.finishTime).to.be.above(response.result.startTime);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} badcommand', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('badcommand');
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

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
                scm: {
                    type: 'invalid'
                },
                head: 'date',
                body: 'uptime',
                tail: 'cat /etc/hosts'
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/start invalidscm', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('invalidscm');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastFail_id = Store.getRunByLabel(job_id, 'lastFail');
                            //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            //expect(lastSuccess_id).to.not.exist();
                            //expect(lastFail_id).to.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('DELETE /api/job/{job_id} invalidscm', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('invalidscm');
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('POST /api/job noscm', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'noscm',
                head: 'date',
                body: 'uptime',
                tail: 'cat /etc/hosts'
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
                scm: {
                    type: 'git',
                    url: 'https://github.com/fishin/tacklebox',
                    branch: 'master'
                },
                head: 'bin/head.sh',
                body: 'bin/body.sh',
                tail: 'bin/tail.sh'
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

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

    it('GET /api/job/{job_id} git', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('git');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/start git', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('git');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

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

    it('GET /api/job/{job_id}/start noscm', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('noscm');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

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

    it('GET /api/job/{job_id}/start noscm labels', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('noscm');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //console.log(JSON.stringify(run, null, 4));
                            //var last_id = Store.getRunByLabel(job_id, 'last');
                            //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            //expect(response.result.run_id.toString()).to.equal(last_id);
                            //expect(response.result.run_id.toString()).to.equal(lastSuccess_id);
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('GET /api/job/{job_id}/runs', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('noscm');
            server.inject({ method: 'GET', url: '/api/job/' + job_id + '/runs'}, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id} git', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('git');
            var run_id = server.plugins.tacklebox.getRuns(job_id)[0].id;
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('succeeded');
                expect(response.result.finishTime).to.be.above(response.result.startTime);
                expect(response.result.elapsedTime).to.exist();
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/bylink last', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('git');
            var run_id = server.plugins.tacklebox.getRuns(job_id)[0].id;
            var lastRun = server.plugins.tacklebox.getRunByLink(job_id, 'last');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/bylink/last'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('succeeded');
                expect(response.result.id).to.exist();
                expect(response.result.id).to.equal(run_id);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
/*
    it('GET /api/job/{job_id}/run/{run_id}/console git', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('git');
            var pail = jobPail.getPail(job_id);
            var run_id = pail.reel_id;
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id + '/console' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.console).to.exist();
                done();
            });
        });
    });
*/
    it('DELETE /api/job/{job_id}/run/{run_id} git', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('git');
            var run_id = server.plugins.tacklebox.getRuns(job_id)[0].id;
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} git', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('git');
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} noscm', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('noscm');
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

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

   it('GET /api/job/{job_id}/start cancel', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('cancel');
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/start'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var run_id = response.result.id;
                server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id + '/cancel' }, function (cancelResponse) {

                    expect(cancelResponse).to.exist();
                });
                var intervalObj = setInterval(function() {

                    server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (newResponse) {

                        if (newResponse.result.finishTime) {
                            clearInterval(intervalObj);
                            //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                            expect(newResponse.result.id).to.exist();
                            expect(newResponse.result.finishTime).to.exist();
                            expect(newResponse.result.status).to.equal('cancelled');
                            //expect(lastSuccess_id).to.not.exist();
                            done();
                        }
                    });
                }, 1000);
            });
        });
    });

    it('DELETE /api/job/{job_id} cancel', function (done) {

        internals.prepareServer(function (server) {

            var job_id = jobPail.getPailByLink('cancel');
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });

});
