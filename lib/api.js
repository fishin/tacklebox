var internals = {};

module.exports = internals.Job = function (options) {

    this.settings = options;
    this.Job = exports.Job;
    this.Run = exports.Run;
    //console.log('settings');
    //console.log(this.settings);
};

exports.Job = require('./api/job'); 
exports.Run = require('./api/run'); 
