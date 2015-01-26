var Bait = require('bait');

var internals = {};

module.exports = function (options) {

    var bait = new Bait(options.job);
    this.startJob = bait.startJob;
    this.createJob = bait.createJob;
    this.deleteJob = bait.deleteJob;
    this.deleteWorkspace = bait.deleteWorkspace;
    this.getWorkspaceArtifact = bait.getWorkspaceArtifact;
    this.getCommits = bait.getCommits;
    this.updateJob = bait.updateJob;
    this.getJob = bait.getJob;
    this.getJobByName = bait.getJobByName;
    this.getJobs = bait.getJobs;
};
