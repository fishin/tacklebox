var Utils = require('../utils');

var internals = {};

module.exports = internals.Run = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.Run.settings = this.settings;
    internals.Run.deleteRun = utils.Job.deleteRun;
    internals.Run.getRun = utils.Job.getRun;
    internals.Run.cancelRun = utils.Job.cancelRun;
    internals.Run.getRunPids = utils.Job.getRunPids;
    internals.Run.getRuns = utils.Job.getRuns;
    internals.Run.getRunByName = utils.Job.getRunByName;
    internals.Run.getArchiveArtifact = utils.Job.getArchiveArtifact;
    internals.Run.getArchiveArtifacts = utils.Job.getArchiveArtifacts;
    internals.Run.archiveArtifacts = utils.Job.archiveArtifacts;
    internals.Run.getTestResult = utils.Job.getTestResult;
    internals.Run.getPullRequest = utils.Job.getPullRequest;
    this.deleteRun = exports.deleteRun;
    this.getRun = exports.getRun;
    this.getRunPids = exports.getRunPids;
    this.getRuns = exports.getRuns;
    this.getRunByName = exports.getRunByName;
    this.cancelRun = exports.cancelRun;
    this.cancelPullRequest = exports.cancelPullRequest;
    this.getPullRequestRun = exports.getPullRequestRun;
    this.getPullRequestRunPids = exports.getPullRequestRunPids;
    this.getPullRequestRuns = exports.getPullRequestRuns;
    this.getArchiveArtifact = exports.getArchiveArtifact;
    this.getArchiveArtifacts = exports.getArchiveArtifacts;
    this.getTestResult = exports.getTestResult;
    //console.log(this);
};

exports.cancelPullRequest = function (request, reply) {

   var token = null;
   internals.Run.getPullRequest(request.params.jobId, request.params.number, token, function(pr) {

       var response = internals.Run.cancelRun(request.params.jobId, pr, request.params.runId);
       reply(response);
   });
};

exports.cancelRun = function (request, reply) {

   var response = internals.Run.cancelRun(request.params.jobId, null, request.params.runId);
   reply(response);
};

exports.getRun = function (request, reply) {

   var response = internals.Run.getRun(request.params.jobId, null, request.params.runId);
   reply(response);
};

exports.getPullRequestRun = function (request, reply) {

   var token = null;
   internals.Run.getPullRequest(request.params.jobId, request.params.number, token, function(pr) {

       var response = internals.Run.getRun(request.params.jobId, pr, request.params.runId);
       reply(response);
   });
};

exports.getPullRequestRunPids = function (request, reply) {

   var token = null;
   internals.Run.getPullRequest(request.params.jobId, request.params.number, token, function(pr) {

       var response = internals.Run.getRunPids(request.params.jobId, pr, request.params.runId);
       reply(response);
   });
};

exports.getRunPids = function (request, reply) {

   var response = internals.Run.getRunPids(request.params.jobId, null, request.params.runId);
   reply(response);
};

exports.getRuns = function (request, reply) {

   var response = internals.Run.getRuns(request.params.jobId, null);
   reply(response);
};

exports.getPullRequestRuns = function (request, reply) {

   var token = null;
   internals.Run.getPullRequest(request.params.jobId, request.params.number, token, function(pr) {

       var response = internals.Run.getRuns(request.params.jobId, pr);
       reply(response);
   });
};

exports.deleteRun = function (request, reply) {

   var response = internals.Run.deleteRun(request.params.jobId, null, request.params.runId);
   reply(response);
};

exports.getRunByName = function (request, reply) {

   var response = internals.Run.getRunByName(request.params.jobId, request.params.name);
   reply(response);
};

exports.getArchiveArtifact = function (request, reply) {

   var response = internals.Run.getArchiveArtifact(request.params.jobId, request.params.runId, request.params.artifact);
   reply(response);
};

exports.getTestResult = function (request, reply) {

   var response = internals.Run.getTestResult(request.params.jobId, request.params.runId, request.params.artifact);
   reply(response);
};

exports.getArchiveArtifacts = function (request, reply) {

   var response = internals.Run.getArchiveArtifacts(request.params.jobId, request.params.runId);
   reply(response);
};
