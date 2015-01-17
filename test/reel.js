var Code = require('code');
var Lab = require('lab');
var Hapi = require('hapi');
var internals = {
    defaults: {
        job: {
            dirPath: '/tmp/testtacklebox/job'
        },
        reel: {
            dirPath: '/tmp/testtacklebox/reel'
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

describe('reel', function () {    

    it('POST /api/reel reel1', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'reel1',
                host: 'localhost',
                size: 4
            };
            server.inject({ method: 'POST', url: '/api/reel', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('POST /api/reel reel2', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'reel2',
                host: 'localhost',
                size: 4
            };
            server.inject({ method: 'POST', url: '/api/reel', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });


   it('GET /api/reel/byname reel1', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/reel/byname/reel1'}, function (response) {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                expect(response.result.name).to.equal('reel1');
                done();
            });
        });
    });

    it('GET /api/reels', function (done) {

        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/reel/{id}', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                var id = response.result[0].id;
                server.inject({ method: 'GET', url: '/api/reel/' + id}, function (response) {

                    //console.log(response.result);
                    expect(response.result.id).to.exist();
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
                expect(response.result).to.have.length(2);
                var id = response.result[0].id;
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

    it('DELETE /api/reel/{id} reel1', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                var id = response.result[0].id;
                server.inject({ method: 'DELETE', url: '/api/reel/' + id}, function (response) {

                    expect(response.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                        expect(response.result).to.have.length(1);
                        done();
                    });
                });
            });
        });
    });

    it('DELETE /api/reel/{id} reel2', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/reels'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                var id = response.result[0].id;
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
