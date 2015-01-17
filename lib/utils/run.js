var Bait = require('bait');

var internals = {};

module.exports = function (options) {

    var bait = new Bait(options.job);
    this.deleteRun = bait.deleteRun;
    this.getRun = bait.getRun;
    this.getRunByLink = bait.getRunByName;
    this.cancelRun = bait.cancelRun;
    this.getRunPids = bait.getRunPids;
    this.getRuns = bait.getRuns;
};
