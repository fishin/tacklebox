var Job = require('./utils/job');
var Notify = require('./utils/notify');
var Run = require('./utils/run');
var Reel = require('./utils/reel');
var User = require('./utils/user');
var FishHook = require('fishhook');

var internals = {};

module.exports = internals.Utils = function (options) {

    var job = new Job(options);
    var notify = new Notify(options);
    var run = new Run(options);
    var reel = new Reel(options);
    var scheduler = new FishHook(options);
    //console.log(scheduler);
    var user = new User(options);
    this.Job = job;
    this.Notify = notify;
    this.Run = run;
    this.Reel = reel;
    this.User = user;
    this.Scheduler = scheduler;
};
