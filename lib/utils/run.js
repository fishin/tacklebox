var Bait = require('bait');

var internals = {};

module.exports = function (options) {

    var bait = new Bait(options.job);
    this.deleteRun = bait.deleteRun;
    this.getRun = bait.getRun;
    this.getRunByName = bait.getRunByName;
    this.cancelRun = bait.cancelRun;
    this.getRunPids = bait.getRunPids;
    this.getRuns = bait.getRuns;
    this.getArchiveArtifact = bait.getArchiveArtifact;
    this.getArchiveArtifacts = bait.getArchiveArtifacts;
};
