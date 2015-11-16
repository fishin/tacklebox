'use strict';

const Utils = require('../utils');
const Fillet = require('fillet');

const internals = {};

module.exports = internals.Run = function (options) {

    this.settings = options;
    const utils = new Utils(options);
    internals.Run.settings = this.settings;
    internals.Run.deleteRun = utils.Job.deleteRun;
    internals.Run.deleteRuns = utils.Job.deleteRuns;
    internals.Run.getRun = utils.Job.getRun;
    internals.Run.getRunStats = Fillet.getRunStats;
    internals.Run.getPreviousRun = utils.Job.getPreviousRun;
    internals.Run.cancelRun = utils.Job.cancelRun;
    internals.Run.getRunPids = utils.Job.getRunPids;
    internals.Run.getRuns = utils.Job.getRuns;
    internals.Run.getRunsStats = Fillet.getRunsStats;
    internals.Run.getRunByName = utils.Job.getRunByName;
    internals.Run.getArchiveArtifact = utils.Job.getArchiveArtifact;
    internals.Run.getArchiveArtifacts = utils.Job.getArchiveArtifacts;
    internals.Run.archiveArtifacts = utils.Job.archiveArtifacts;
    internals.Run.getTestResult = utils.Job.getTestResult;
    internals.Run.getPullRequest = utils.Job.getPullRequest;
    this.deleteRun = exports.deleteRun;
    this.deleteRuns = exports.deleteRuns;
    this.getRun = exports.getRun;
    this.getRunStats = exports.getRunStats;
    this.getPreviousRun = exports.getPreviousRun;
    this.getRunPids = exports.getRunPids;
    this.getRuns = exports.getRuns;
    this.getRunsStats = exports.getRunsStats;
    this.getRunsStatsLimit = exports.getRunsStatsLimit;
    this.getRunByName = exports.getRunByName;
    this.cancelRun = exports.cancelRun;
    this.cancelPullRequest = exports.cancelPullRequest;
    this.getPullRequestRun = exports.getPullRequestRun;
    this.getPullRequestPreviousRun = exports.getPullRequestPreviousRun;
    this.getPullRequestRunPids = exports.getPullRequestRunPids;
    this.getPullRequestRuns = exports.getPullRequestRuns;
    this.getArchiveArtifact = exports.getArchiveArtifact;
    this.getArchiveArtifacts = exports.getArchiveArtifacts;
    this.getTestResult = exports.getTestResult;
    //console.log(this);
};

exports.cancelPullRequest = function (request, reply) {

    const token = internals.Run.settings.github.token;
    internals.Run.getPullRequest(request.params.jobId, request.params.number, token, (pr) => {

        const response = internals.Run.cancelRun(request.params.jobId, pr, request.params.runId);
        reply(response);
    });
};

exports.cancelRun = function (request, reply) {

    const response = internals.Run.cancelRun(request.params.jobId, null, request.params.runId);
    reply(response);
};

exports.getRun = function (request, reply) {

    const response = internals.Run.getRun(request.params.jobId, null, request.params.runId);
    reply(response);
};

exports.getRunStats = function (request, reply) {

    const run = internals.Run.getRun(request.params.jobId, null, request.params.runId);
    const fillet = new Fillet({});
    const response = fillet.getRunStats(run);
    reply(response);
};

exports.getPreviousRun = function (request, reply) {

    const response = internals.Run.getPreviousRun(request.params.jobId, null, request.params.runId);
    reply(response);
};

exports.getPullRequestRun = function (request, reply) {

    const token = internals.Run.settings.github.token;
    internals.Run.getPullRequest(request.params.jobId, request.params.number, token, (pr) => {

        const response = internals.Run.getRun(request.params.jobId, pr, request.params.runId);
        reply(response);
    });
};

exports.getPullRequestPreviousRun = function (request, reply) {

    const token = internals.Run.settings.github.token;
    internals.Run.getPullRequest(request.params.jobId, request.params.number, token, (pr) => {

        const response = internals.Run.getPreviousRun(request.params.jobId, pr, request.params.runId);
        reply(response);
    });
};

exports.getPullRequestRunPids = function (request, reply) {

    const token = internals.Run.settings.github.token;
    internals.Run.getPullRequest(request.params.jobId, request.params.number, token, (pr) => {

        const response = internals.Run.getRunPids(request.params.jobId, pr, request.params.runId);
        reply(response);
    });
};

exports.getRunPids = function (request, reply) {

    const response = internals.Run.getRunPids(request.params.jobId, null, request.params.runId);
    reply(response);
};

exports.getRuns = function (request, reply) {

    const response = internals.Run.getRuns(request.params.jobId, null);
    reply(response);
};

exports.getRunsStats = function (request, reply) {

    const runs = internals.Run.getRuns(request.params.jobId, null);
    const fillet = new Fillet({});
    const response = fillet.getRunsStats(runs);
    reply(response);
};

exports.getRunsStatsLimit = function (request, reply) {

    const runs = internals.Run.getRuns(request.params.jobId, null);
    const fillet = new Fillet({});
    const response = fillet.getRunsStats(runs, request.params.limit);
    reply(response);
};

exports.getPullRequestRuns = function (request, reply) {

    const token = internals.Run.settings.github.token;
    internals.Run.getPullRequest(request.params.jobId, request.params.number, token, (pr) => {

        const response = internals.Run.getRuns(request.params.jobId, pr);
        reply(response);
    });
};

exports.deleteRun = function (request, reply) {

    const response = internals.Run.deleteRun(request.params.jobId, null, request.params.runId);
    reply(response);
};

exports.deleteRuns = function (request, reply) {

    const response = internals.Run.deleteRuns(request.params.jobId, null);
    reply(response);
};

exports.getRunByName = function (request, reply) {

    const response = internals.Run.getRunByName(request.params.jobId, request.params.name);
    reply(response);
};

exports.getArchiveArtifact = function (request, reply) {

    const response = internals.Run.getArchiveArtifact(request.params.jobId, request.params.runId, request.params.artifact);
    reply(response);
};

exports.getTestResult = function (request, reply) {

    const response = internals.Run.getTestResult(request.params.jobId, request.params.runId);
    reply(response);
};

exports.getArchiveArtifacts = function (request, reply) {

    const response = internals.Run.getArchiveArtifacts(request.params.jobId, request.params.runId);
    reply(response);
};
