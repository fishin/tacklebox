var Code = require('code');
var Lab = require('lab');
var Hapi = require('hapi');

var internals = {
    defaults: {
        user: {
            dirPath: __dirname + '/tmp/user'
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

describe('user', function () {

    it('POST /api/password', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                password: 'password'
            };
            server.inject({ method: 'POST', url: '/api/password', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.equal(60);
                done();
            });
        });
    });

    it('GET /api/password/{length}', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/password/10'}, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.length).to.equal(10);
                done();
            });
        });
    });

    it('POST /api/user lloyd', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'lloyd',
                type: 'local',
                displayName: 'Lloyd Benson1',
                email: 'lloyd.benson@gmail.com',
                password: 'password'
            };
            server.inject({ method: 'POST', url: '/api/user', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('POST /api/user backer', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                name: 'backer',
                type: 'local',
                displayName: 'Ben Acker',
                email: 'ben.acker@gmail.com',
                password: 'password'
            };
            server.inject({ method: 'POST', url: '/api/user', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/users', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/users'}, function (response) {

                //console.log(response);
                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/user/{id}', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/users'}, function (response) {

                expect(response.statusCode).to.equal(200);
                var id = response.result[0].id;
                server.inject({ method: 'GET', url: '/api/user/' + id}, function (response) {

                    //console.log(response.result);
                    expect(response.result.id).to.exist();
                    expect(response.result.displayName).to.equal('Lloyd Benson1');
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

    it('GET /api/user/byname/{name} lloyd', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/user/byname/lloyd' }, function (response) {

                expect(response.statusCode).to.equal(200);
                //console.log(response.result);
                expect(response.result.id).to.exist();
                expect(response.result.name).to.equal('lloyd');
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    it('POST /api/user/{id}/validate lloyd', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/user/byname/lloyd' }, function (response) {

                var userId = response.result.id;
                var payload = { password: 'password' };
                server.inject({ method: 'POST', url: '/api/user/' + userId + '/validate', payload: payload }, function (response) {

                    //console.log(response);
                    expect(response.statusCode).to.equal(200);
                    expect(response.result).to.be.true();
                    done();
                });
            });
        });
    });

    it('POST /api/user/{id}', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/users' }, function (response) {

                expect(response.statusCode).to.equal(200);
                var id = response.result[0].id;
                var payload = { name: 'Lloyd Benson' };
                server.inject({ method: 'POST', url: '/api/user/' + id, payload: payload }, function (response) {

                    //console.log(response.result);
                    expect(response.statusCode).to.equal(200);
                    expect(response.result.name).to.equal('Lloyd Benson');
                    done();
                });
            });
        });
    });

    it('DELETE /api/user/{id} lloyd', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/users'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                var id = response.result[0].id;
                server.inject({ method: 'DELETE', url: '/api/user/' + id }, function (response) {

                    expect(response.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/users' }, function (response) {

                        expect(response.result).to.have.length(1);
                        done();
                    });
                });
            });
        });
    });

    it('DELETE /api/user/{id} backer', function (done) {

        internals.prepareServer(function (server) {

            server.inject({ method: 'GET', url: '/api/users'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(1);
                var id = response.result[0].id;
                server.inject({ method: 'DELETE', url: '/api/user/' + id}, function (response) {

                    expect(response.statusCode).to.equal(200);
                    server.inject({ method: 'GET', url: '/api/users'}, function (response) {

                        expect(response.result).to.have.length(0);
                        done();
                    });
                });
            });
        });
    });

});
