var Pail = require('pail');
var Hoek = require('hoek');

var internals = {};

module.exports = internals.Reel = function (options) {

    internals.Reel.settings = options;
    internals.Reel.getReel = exports.getReel;
    this.createReel = exports.createReel;
    this.deleteReel = exports.deleteReel;
    this.getReel = exports.getReel;
    this.getReelByName = exports.getReelByName;
    this.updateReel = exports.updateReel;
    this.getReels = exports.getReels;
};

exports.createReel = function (payload) {

    var pail = new Pail(internals.Reel.settings.reel);
    var updatePail = pail.createPail(payload);
    return updatePail;
};

exports.updateReel = function (reelId, payload) {

    var pail = new Pail(internals.Reel.settings.reel);
    var getPail = pail.getPail(reelId);
    var config = Hoek.applyToDefaults(getPail, payload);
    config.updateTime = new Date().getTime();
    var updatedPail = pail.updatePail(config);
    return updatedPail;
};

exports.getReel = function (reelId) {

    var pail = new Pail(internals.Reel.settings.reel);
    var config = pail.getPail(reelId);
    return config;
};

exports.getReelByName = function (name) {

    var pail = new Pail(internals.Reel.settings.reel);
    var reelId = pail.getPailByName(name);
    var config = pail.getPail(reelId);
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

       return b.createTime - a.createTime;
    });
    return fullReels;
};

exports.deleteReel = function (reelId) {

    var pail = new Pail(internals.Reel.settings.reel);
    pail.deletePail(reelId);
    return null;
};
