var Angler = require('angler');
var Bait = require('bait');
var FishHook = require('fishhook');
var Notify = require('./utils/notify');
var Reel = require('./utils/reel');

var internals = {};

module.exports = internals.Utils = function (options) {

    var bait = new Bait(options.job);
    this.Job = bait;
    var notify = new Notify(options);
    this.Notify = notify;
    var reel = new Reel(options);
    this.Reel = reel;
    var user = new Angler(options.job);
    this.User = user;
    var scheduler = new FishHook(options);
    this.Scheduler = scheduler;
};
