var Pail = require('pail');
var Hoek = require('hoek');

var internals = {};

module.exports = internals.Queue = function (options) {

    this.settings = options;
    internals.Queue.settings = options;
    this.createQueue = exports.createQueue;
    this.deleteQueue = exports.deleteQueue;
    this.getQueue = exports.getQueue;
    this.updateQueue = exports.updateQueue;
    this.getQueues = exports.getQueues;
//    this.addJob = exports.addJob;
//    this.removeJob = exports.removeJob;
};
/*
exports.addJob = function (request,reply) {

    var job = {
        id: 1
    };
    internals.queues[0].lines.push(job);
};

exports.removeJob = function (request,reply) {

    var job = {
        id: 1
    };
    internals.queues[0].lines.pop();
};
*/

exports.createQueue = function (request,reply) {

    var pail = new Pail(internals.Queue.settings.queue);
    var lines = [];
    var queue = {
        name: request.payload.name,
        size: request.payload.size,
        lines: lines
    };
    var savePail = pail.savePail(queue);
    reply(savePail);
};

exports.updateQueue = function (request,reply) {

    var pail = new Pail(internals.Queue.settings.queue);
    var getPail = pail.getPail(request.params.id);
    var config = Hoek.applyToDefaults(getPail, request.payload);
    config.updateTime = new Date().getTime();
    var updatedPail = pail.savePail(config);
    reply(updatedPail);
};

exports.getQueue = function (request,reply) {

    var pail = new Pail(internals.Queue.settings.queue);
    var getPail = pail.getPail(request.params.id);
    reply(getPail);
};

exports.getQueues = function (request,reply) {

    var pail = new Pail(internals.Queue.settings.queue);
    var pails = pail.getPails();
    reply(pails);
};

exports.deleteQueue = function (request,reply) {

    var pail = new Pail(internals.Queue.settings.queue);
    pail.deletePail(request.params.id);
    reply('');
};
