var Angler = require('angler');
var Bait = require('bait');
var Reel = require('reel');
var Notify = require('./utils/notify');

var internals = {};

module.exports = internals.Utils = function (options) {

    var bait = new Bait(options.job);
    this.Job = bait;
    var notify = new Notify(options);
    this.Notify = notify;
    var reel = new Reel(options.reel);
    this.Reel = reel;
    var user = new Angler(options.user);
    this.User = user;
};
