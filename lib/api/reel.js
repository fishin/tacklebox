var Utils = require('../utils');

var internals = {};

module.exports = internals.Reel = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.Reel.settings = options;
    internals.Reel.createReel = utils.Reel.createReel;
    internals.Reel.deleteReel = utils.Reel.deleteReel;
    internals.Reel.getReel = utils.Reel.getReel;
    internals.Reel.getReelByLink = utils.Reel.getReelByLink;
    internals.Reel.updateReel = utils.Reel.updateReel;
    internals.Reel.getReels = utils.Reel.getReels;
    this.createReel = exports.createReel;
    this.deleteReel = exports.deleteReel;
    this.getReel = exports.getReel;
    this.getReelByLink = exports.getReelByLink;
    this.updateReel = exports.updateReel;
    this.getReels = exports.getReels;
};

exports.createReel = function (request,reply) {

    var reel = internals.Reel.createReel(request.payload);
    reply(reel);
};

exports.updateReel = function (request,reply) {

    var reel = internals.Reel.updateReel(request.params.reelId, request.payload);
    reply(reel);
};

exports.getReel = function (request,reply) {

    var reel = internals.Reel.getReel(request.params.reelId);
    reply(reel);
};

exports.getReelByLink = function (request, reply) {

   var response = internals.Reel.getReelByLink(request.params.link);
   reply(response);
};

exports.getReels = function (request,reply) {

    var reels = internals.Reel.getReels();
    reply(reels);
};

exports.deleteReel = function (request,reply) {

    internals.Reel.deleteReel(request.params.reelId);
    reply('');
};
