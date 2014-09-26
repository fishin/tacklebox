var Pail = require('pail');
var Hoek = require('hoek');

var internals = {};

module.exports = internals.Reel = function (options) {

    this.settings = options;
    internals.Reel.settings = options;
    this.createReel = exports.createReel;
    this.deleteReel = exports.deleteReel;
    this.getReel = exports.getReel;
    this.getReelByName = exports.getReelByName;
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

exports.createReel = function (payload) {

    var pail = new Pail(internals.Reel.settings.reel);
    var updatePail = pail.createPail(payload);
    return updatePail;
};

exports.updateReel = function (reel_id, payload) {

    var pail = new Pail(internals.Reel.settings.reel);
    var getPail = pail.getPail(reel_id);
    var config = Hoek.applyToDefaults(getPail, payload);
    config.updateTime = new Date().getTime();
    var updatedPail = pail.updatePail(config);
    return updatedPail;
};

exports.getReel = function (reel_id) {

    var pail = new Pail(internals.Reel.settings.reel);
    var config = pail.getPail(reel_id);
    return config;
};

exports.getReelByName = function (name) {

    var pail = new Pail(internals.Reel.settings.reel);
    var reel_id = pail.getPailByName(name);
    var config = pail.getPail(reel_id);
    return config;
};

exports.getReels = function () {

    var pail = new Pail(internals.Reel.settings.reel);
    var pails = pail.getPails();
    return pails;
};

exports.deleteReel = function (reel_id) {

    var pail = new Pail(internals.Reel.settings.reel);
    pail.deletePail(reel_id);
    return null;
};
