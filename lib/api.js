var Job = require('./api/job');
var Run = require('./api/run');
var Queue = require('./api/queue');

var internals = {};

module.exports = internals.Api = function (options) {

    this.settings = options;
    var job = new Job(options);
    var run = new Run(options);
    var queue = new Queue(options);
    this.Job = job;
    this.Run = run;
    this.Queue = queue;
    //console.log('settings');
    //console.log(this.settings);
};
