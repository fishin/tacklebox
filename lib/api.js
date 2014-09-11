var Job = require('./api/job');

var internals = {};

module.exports = internals.Api = function (options) {

    this.settings = options;
    var job = new Job(options);
    this.Job = job;
    this.Run = exports.Run;
    //console.log('settings');
    //console.log(this.settings);
};

exports.Job = require('./api/job'); 
exports.Run = require('./api/run'); 
