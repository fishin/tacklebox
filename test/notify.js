var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');

var internals = {
    defaults: {
        apiPath: '/api',
        notify: {
            plugins: {
                email: {
                    plugin: require('brag'),
                    options: {
                        transporter: {
                            service: 'gmail',
                            auth: {
                                user: 'lloyd.benson@gmail.com',
                                 pass: 'password'
                            }
                        },
                        from: 'donotreply@ficion.net',
                        subjectHeader: '[ficion]'
                    }
                }
            }
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

describe('notify', function () {

    it('POST /api/notify email', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                type: 'email',
                to: 'lloydbenson@gmail.com',
                subject: 'test',
                message: 'this is a body of text'
            };
            server.inject({ method: 'POST', url: '/api/notify', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('failed');
                expect(response.result.message.code).to.equal('EAUTH');
                done();
            });
        });
    });

    it('POST /api/notify invalid', function (done) {

        internals.prepareServer(function (server) {

            var payload = {
                type: 'invalid'
            };
            server.inject({ method: 'POST', url: '/api/notify', payload: payload }, function (response) {

                //console.log(response.result);
                expect(response.statusCode).to.equal(200);
                expect(response.result.status).to.equal('failed');
                expect(response.result.message).to.equal('no valid notify type');
                done();
            });
        });
    });
});
