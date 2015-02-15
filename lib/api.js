var Job = require('./api/job');
var Notify = require('./api/notify');
var Run = require('./api/run');
var Reel = require('./api/reel');
//var User = require('./api/user');

var internals = {};

module.exports = internals.Api = function (options) {

    this.settings = options;
    var job = new Job(options);
    var notify = new Notify(options);
    var run = new Run(options);
    var reel = new Reel(options);
//    var user = new User(options);
    this.Job = job;
    this.Notify = notify;
    this.Run = run;
    this.Reel = reel;
//    this.User = user;
    //console.log('settings');
    //console.log(this.settings);
};
