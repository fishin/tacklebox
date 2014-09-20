var Pail = require('pail');
var Hoek = require('hoek');

var internals = {};

module.exports = internals.Reel = function (options) {

    this.settings = options;
    internals.Reel.settings = options;
    this.createReel = exports.createReel;
    this.deleteReel = exports.deleteReel;
    this.getReel = exports.getReel;
    this.updateReel = exports.updateReel;
    this.getReels = exports.getReels;
//    this.addJob = exports.addJob;
//    this.removeJob = exports.removeJob;
};
/*
exports.addJob = function (request,reply) {

    var job = {
        id: 1
    };
    internals.reels[0].lines.push(job);
};

exports.removeJob = function (request,reply) {

    var job = {
        id: 1
    };
    internals.reels[0].lines.pop();
};
*/

exports.createReel = function (request,reply) {

    var pail = new Pail(internals.Reel.settings.reel);
    var lines = [];
    var reel = {
        name: request.payload.name,
        size: request.payload.size,
        lines: lines
    };
    var savePail = pail.savePail(reel);
    reply(savePail);
};

exports.updateReel = function (request,reply) {

    var pail = new Pail(internals.Reel.settings.reel);
    var getPail = pail.getPail(request.params.id);
    var config = Hoek.applyToDefaults(getPail, request.payload);
    config.updateTime = new Date().getTime();
    var updatedPail = pail.savePail(config);
    reply(updatedPail);
};

exports.getReel = function (request,reply) {

    var pail = new Pail(internals.Reel.settings.reel);
    var getPail = pail.getPail(request.params.id);
    reply(getPail);
};

exports.getReels = function (request,reply) {

    var pail = new Pail(internals.Reel.settings.reel);
    var pails = pail.getPails();
    reply(pails);
};

exports.deleteReel = function (request,reply) {

    var pail = new Pail(internals.Reel.settings.reel);
    pail.deletePail(request.params.id);
    reply('');
};
