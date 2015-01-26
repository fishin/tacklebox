var Utils = require('../utils');

var internals = {};

module.exports = internals.Run = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.Run.settings = this.settings;
    internals.Run.deleteRun = utils.Run.deleteRun;
    internals.Run.getRun = utils.Run.getRun;
    internals.Run.cancelRun = utils.Run.cancelRun;
    internals.Run.getRunPids = utils.Run.getRunPids;
    internals.Run.getRuns = utils.Run.getRuns;
    internals.Run.getRunByName = utils.Run.getRunByName;
    internals.Run.getArchiveArtifact = utils.Run.getArchiveArtifact;
    internals.Run.archiveArtifacts = utils.Run.archiveArtifacts;
    this.deleteRun = exports.deleteRun;
    this.getRun = exports.getRun;
    this.getRunPids = exports.getRunPids;
    this.getRuns = exports.getRuns;
    this.getRunByName = exports.getRunByName;
    this.cancelRun = exports.cancelRun;
    this.getArchiveArtifact = exports.getArchiveArtifact;
    //console.log(this);
};

exports.cancelRun = function (request, reply) {

   var response = internals.Run.cancelRun(request.params.jobId, request.params.runId);
   reply(response);
};

/*

exports.getConsole = function (request, reply) {

    var response = {
        jobId: request.params.jobId,
        runId: request.params.runId
        //console: file
    }
    reply(response);
};

*/
exports.getRun = function (request, reply) {

   var response = internals.Run.getRun(request.params.jobId, request.params.runId);
   reply(response);
};

exports.getRunPids = function (request, reply) {

   var response = internals.Run.getRunPids(request.params.jobId, request.params.runId);
   reply(response);
};

exports.getRuns = function (request, reply) {

   var response = internals.Run.getRuns(request.params.jobId);
   reply(response);
};

exports.deleteRun = function (request, reply) {

   var response = internals.Run.deleteRun(request.params.jobId, request.params.runId);
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
