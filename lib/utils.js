var Job = require('./utils/job');
var Run = require('./utils/run');
var Reel = require('./utils/reel');

var internals = {};

module.exports = internals.Utils = function (options) {

    this.settings = options;
    var job = new Job(options);
    var run = new Run(options);
    var reel = new Reel(options);
    this.Job = job;
    this.Run = run;
    this.Reel = reel;
    //console.log('settings');
    //console.log(this.settings);
};
