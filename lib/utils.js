var Bait = require('bait');
var FishHook = require('fishhook');
var Notify = require('./utils/notify');
var Reel = require('./utils/reel');
var User = require('./utils/user');

var internals = {};

module.exports = internals.Utils = function (options) {

    var bait = new Bait(options.job);
    this.Job = bait;
    var notify = new Notify(options);
    this.Notify = notify;
    var reel = new Reel(options);
    this.Reel = reel;
    var user = new User(options);
    this.User = user;
    var scheduler = new FishHook(options);
    this.Scheduler = scheduler;
};
