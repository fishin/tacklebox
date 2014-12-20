var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Notify = require('../lib/notify');

var internals = {};

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

describe('notify', function () {

    it('email', function (done) {

        var notify = {
            type: 'email',
            jobId: 1,
            runId: 1,
            subject: 'test',
            recipients: [ 'lloydbenson@gmail.com', 'backer@gmail.com' ],
            body: 'this is a body of text',
            host: 'localhost',
            port: 25
        };
        var expectedResult = '{"status":"success"}';
        var status = JSON.stringify(Notify.notify(notify));
        expect(status).to.equal(expectedResult);
        done();
    });

    it('invalid', function (done) {

        var notify = {
            type: 'invalid'
        };
        var expectedResult = '{"status":"failed","message":"no valid notify type"}';
        var status = JSON.stringify(Notify.notify(notify));
        expect(status).to.equal(expectedResult);
        done();
    });
});
