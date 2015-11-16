'use strict';

const Utils = require('../utils');

const internals = {};

module.exports = internals.Reel = function (options) {

    this.settings = options;
    const utils = new Utils(options);
    internals.Reel.settings = options;
    internals.Reel.createReel = utils.Reel.createReel;
    internals.Reel.deleteReel = utils.Reel.deleteReel;
    internals.Reel.getReel = utils.Reel.getReel;
    internals.Reel.getReelByName = utils.Reel.getReelByName;
    internals.Reel.updateReel = utils.Reel.updateReel;
    internals.Reel.getReels = utils.Reel.getReels;
    this.createReel = exports.createReel;
    this.deleteReel = exports.deleteReel;
    this.getReel = exports.getReel;
    this.getReelByName = exports.getReelByName;
    this.updateReel = exports.updateReel;
    this.getReels = exports.getReels;
};

exports.createReel = function (request, reply) {

    const reel = internals.Reel.createReel(request.payload);
    reply(reel);
};

exports.updateReel = function (request, reply) {

    const reel = internals.Reel.updateReel(request.params.reelId, request.payload);
    reply(reel);
};

exports.getReel = function (request, reply) {

    const reel = internals.Reel.getReel(request.params.reelId);
    reply(reel);
};

exports.getReelByName = function (request, reply) {

    const response = internals.Reel.getReelByName(request.params.name);
    reply(response);
};

exports.getReels = function (request, reply) {

    const reels = internals.Reel.getReels();
    reply(reels);
};

exports.deleteReel = function (request, reply) {

    internals.Reel.deleteReel(request.params.reelId);
    reply('');
};
