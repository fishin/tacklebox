var Job = require('./utils/job');
var Run = require('./utils/run');

var internals = {};

module.exports = internals.Utils = function (options) {

    this.settings = options;
    var job = new Job(options);
    var run = new Run(options);
    this.Job = job;
    this.Run = run;
    //console.log('settings');
    //console.log(this.settings);
};
