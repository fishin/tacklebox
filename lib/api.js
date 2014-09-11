var Job = require('./api/job');
var Run = require('./api/run');

var internals = {};

module.exports = internals.Api = function (options) {

    this.settings = options;
    var job = new Job(options);
    var run = new Run(options);
    this.Job = job;
    this.Run = run;
    //console.log('settings');
    //console.log(this.settings);
};
