var Bait = require('bait');
var FishHook = require('fishhook');
//var Job = require('./utils/job');
var Notify = require('./utils/notify');
//var Run = require('./utils/run');
var Reel = require('./utils/reel');
var User = require('./utils/user');

var internals = {};

module.exports = internals.Utils = function (options) {

    //var job = new Bait(ptions);
    var notify = new Notify(options);
    //var run = new Run(options);
    var reel = new Reel(options);
    var user = new User(options);
    this.Notify = notify;
    //this.Run = run;
    this.Reel = reel;
    this.User = user;
    var scheduler = new FishHook(options);
    //console.log(scheduler);
    this.Scheduler = scheduler;
    var bait = new Bait(options.job);
    this.Job = bait;
};
