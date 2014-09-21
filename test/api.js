var Lab = require('lab');
var Hapi = require('hapi');
var Pail = require('pail');

var internals = {
    defaults: {
        job: {
            pailPath: '/tmp/testtacklebox/job',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        run: {
            pailPath: '/tmp/testtacklebox/run',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        reel: {
            pailPath: '/tmp/testtacklebox/reel',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};

var jobPail = new Pail(internals.defaults.job);
var runPail = new Pail(internals.defaults.run);
var reelPail = new Pail(internals.defaults.reel);

var lab = exports.lab = Lab.script();
var expect = Lab.expect;
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;

internals.prepareServer = function (callback) {
    var server = new Hapi.Server();

    server.pack.register({

        plugin: require('..'),
        options: internals.defaults
    }, function (err) {

        expect(err).to.not.exist;
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
                expect(response.payload).to.exist;
                expect(response.result.id).to.exist;
                done();
            });
        });
   });

   it('GET /api/job/{job_id}/run parallelcommand', function (done) {
        var job_id = jobPail.getPailByName('parallelcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.job_id).to.exist;
                //expect(lastSuccess_id).to.not.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} parallelcommand', function (done) {
        var job_id = jobPail.getPailByName('parallelcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
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
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.not.exist;
                expect(response.result.err).to.exist;
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
                expect(response.payload).to.exist;
                expect(response.result.id).to.exist;
                done();
            });
        });
    });

// want to try to abort this
// maybe background a process that runs every 1s and tries to kill the specific command by the same user?
// generate bash script with sleep with specific name
    it('GET /api/job/{job_id}/run sleep5', function (done) {
        var job_id = jobPail.getPailByName('sleep5');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                //expect(lastSuccess_id).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} sleep5', function (done) {
        var job_id = jobPail.getPailByName('sleep5');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
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
                expect(response.payload).to.exist;
                expect(response.result.id).to.exist;
                done();
            });
        });
    });

    it('PUT /api/job/{job_id} badcommand', function (done) {
        var job_id = jobPail.getPailByName('badcmd');
        var payload = { name: 'badcommand', command: 'uptim' };
        internals.prepareServer(function (server) {
            server.inject({ method: 'PUT', url: '/api/job/'+ job_id, payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.updateTime).to.exist;
                expect(response.result.name).to.equal('badcommand');
                expect(response.result.command).to.equal('uptim');
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run badcommand', function (done) {
        var job_id = jobPail.getPailByName('badcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                //var lastFail_id = Store.getRunByLabel(job_id, 'lastFail');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                //expect(lastFail_id).to.exist;
                //expect(lastSuccess_id).to.not.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id} badcommand', function (done) {
        var job_id = jobPail.getPailByName('badcommand');
        var job = jobPail.getPail(job_id);
        var run_id = job.runs[0];
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                //expect(response.result.status).is.equal('failed');
                expect(response.result.finishTime).is.greaterThan(response.result.startTime);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} badcommand', function (done) {
        var job_id = jobPail.getPailByName('badcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
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
                expect(response.payload).to.exist;
                expect(response.result.id).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run invalidscm', function (done) {
        var job_id = jobPail.getPailByName('invalidscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                //var lastFail_id = Store.getRunByLabel(job_id, 'lastFail');
                //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.job_id).to.exist;
                //expect(lastSuccess_id).to.not.exist;
                //expect(lastFail_id).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} invalidscm', function (done) {
        var job_id = jobPail.getPailByName('invalidscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
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
                expect(response.payload).to.exist;
                expect(response.result.id).to.exist;
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
                expect(response.payload).to.exist;
                expect(response.result.id).to.exist;
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
        var job_id = jobPail.getPailByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run git', function (done) {
        var job_id = jobPail.getPailByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                var run_id = response.result.run_id;
                var run = runPail.getPail(run_id);
                //console.log(JSON.stringify(run, null, 4));
                expect(response.statusCode).to.equal(200);
                expect(run_id).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run noscm', function (done) {
        var job_id = jobPail.getPailByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run noscm labels', function (done) {
        var job_id = jobPail.getPailByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                //var last_id = Store.getRunByLabel(job_id, 'last');
                //var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                //expect(response.result.run_id.toString()).to.equal(last_id);
                //expect(response.result.run_id.toString()).to.equal(lastSuccess_id);
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/runs', function (done) {

        var job_id = jobPail.getPailByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/' + job_id + '/runs'}, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(3);
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id} git', function (done) {
        var job_id = jobPail.getPailByName('git');
        var job = jobPail.getPail(job_id);
        var run_id = job.runs[0];
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).is.equal('succeeded');
                expect(response.result.finishTime).is.greaterThan(response.result.startTime);
                expect(response.result.elapsedTime).to.exist;
                expect(response.payload).to.exist;
                done();
            });
        });
    });
/*
    it('GET /api/job/{job_id}/run/{run_id}/console git', function (done) {
        var job_id = jobPail.getPailByName('git');
        var pail = jobPail.getPail(job_id);
        var run_id = pail.reel_id;
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id + '/console' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.console).to.exist;
                done();
            });
        });
    });
*/
    it('DELETE /api/job/{job_id}/run/{run_id} git', function (done) {
        var job_id = jobPail.getPailByName('git');
        var job = jobPail.getPail(job_id);
        var run_id = job.runs[0];
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} git', function (done) {
        var job_id = jobPail.getPailByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} noscm', function (done) {
        var job_id = jobPail.getPailByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('POST /api/reel', function (done) {

        var payload = {
            name: 'global',
            size: 4
        };
        internals.prepareServer(function (server) {
            server.inject({ method: 'POST', url: '/api/reel', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist;
                done();
            });
        });
    });

    it('GET /api/reels', function (done) {

        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                done();
            });
        });
    });

    it('GET /api/reel/{id}', function (done) {

        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                var id = response.result[0];
                server.inject({ method: 'GET', url: '/api/reel/' + id}, function (response) {

                    //console.log(response.result);
                    expect(response.result.id).to.exist;
                    expect(response.result.size).to.equal(4);
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('POST /api/reel/{id}', function (done) {

        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                var id = response.result[0];
                var payload = { size: 5 };
                server.inject({ method: 'POST', url: '/api/reel/' + id, payload: payload}, function (response) {

                    //console.log(response.result);
                    expect(response.statusCode).to.equal(200);
                    expect(response.result.size).to.equal(5);
                    done();
                });
            });
        });
    });

    it('DELETE /api/reel/{id}', function (done) {

        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                var id = response.result[0];
                server.inject({ method: 'DELETE', url: '/api/reel/' + id}, function (response) {

                    expect(response.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                        expect(response.result).to.have.length(0);
                        done();
                    });
                });
            });
        });
    });

});
