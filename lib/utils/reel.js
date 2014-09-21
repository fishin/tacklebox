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

exports.createReel = function (payload) {

    var pail = new Pail(internals.Reel.settings.reel);
    var savePail = pail.savePail(payload);
    return savePail;
};

exports.updateReel = function (id, payload) {

    var pail = new Pail(internals.Reel.settings.reel);
    var getPail = pail.getPail(id);
    var config = Hoek.applyToDefaults(getPail, payload);
    config.updateTime = new Date().getTime();
    var updatedPail = pail.savePail(config);
    return updatedPail;
};

exports.getReel = function (id) {

    var pail = new Pail(internals.Reel.settings.reel);
    var getPail = pail.getPail(id);
    return getPail;
};

exports.getReels = function () {

    var pail = new Pail(internals.Reel.settings.reel);
    var pails = pail.getPails();
    return pails;
};

exports.deleteReel = function (id) {

    var pail = new Pail(internals.Reel.settings.reel);
    pail.deletePail(id);
    return null;
};