var Utils = require('../utils');

var internals = {};

module.exports = internals.Reel = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.Reel.settings = options;
    internals.Reel.createReel = utils.Reel.createReel;
    internals.Reel.deleteReel = utils.Reel.deleteReel;
    internals.Reel.getReel = utils.Reel.getReel;
    internals.Reel.updateReel = utils.Reel.updateReel;
    internals.Reel.getReels = utils.Reel.getReels;
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

    var reel = internals.Reel.createReel(request.payload);
    reply(reel);
};

exports.updateReel = function (request,reply) {

    var reel = internals.Reel.updateReel(request.params.id, request.payload);
    reply(reel);
};

exports.getReel = function (request,reply) {

    var reel = internals.Reel.getReel(request.params.id);
    reply(reel);
};

exports.getReels = function (request,reply) {

    var reels = internals.Reel.getReels();
    reply(reels);
};

exports.deleteReel = function (request,reply) {

    internals.Reel.deleteReel(request.params.id);
    reply('');
};
