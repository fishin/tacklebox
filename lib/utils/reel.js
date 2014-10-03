var Pail = require('pail');
var Hoek = require('hoek');

var internals = {};

module.exports = internals.Reel = function (options) {

    this.settings = options;
    internals.Reel.settings = options;
    internals.Reel.getReel = exports.getReel;
    this.createReel = exports.createReel;
    this.deleteReel = exports.deleteReel;
    this.getReel = exports.getReel;
    this.getReelByLink = exports.getReelByLink;
    this.updateReel = exports.updateReel;
    this.getReels = exports.getReels;
};

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

exports.getReelByLink = function (link) {

    var pail = new Pail(internals.Reel.settings.reel);
    var reel_id = pail.getPailByLink(link);
    var config = pail.getPail(reel_id);
    return config;
};

exports.getReels = function () {

    var pail = new Pail(internals.Reel.settings.reel);
    var reels = pail.getPails();
    var fullReels = [];
    for (var i = 0; i < reels.length; i++) {
        var reel = internals.Reel.getReel(reels[i]);
        fullReels.push(reel);
    }
    // sort by createTime
    fullReels.sort(function(a, b){

       return b.createTime-a.createTime;
    });
    return fullReels;
};

exports.deleteReel = function (reel_id) {

    var pail = new Pail(internals.Reel.settings.reel);
    pail.deletePail(reel_id);
    return null;
};
