'use strict';

const Utils = require('../utils');

const internals = {};

module.exports = internals.Job = function (options) {

    this.settings = options;
    const utils = new Utils(options);
    internals.Job.settings = this.settings;
    internals.Job.startJob = utils.Job.startJob;
    internals.Job.createJob = utils.Job.createJob;
    internals.Job.deleteJob = utils.Job.deleteJob;
    internals.Job.deleteWorkspace = utils.Job.deleteWorkspace;
    internals.Job.updateJob = utils.Job.updateJob;
    internals.Job.getJob = utils.Job.getJob;
    internals.Job.getJobByName = utils.Job.getJobByName;
    internals.Job.getJobs = utils.Job.getJobs;
    internals.Job.getAllCommits = utils.Job.getAllCommits;
    internals.Job.getCompareCommits = utils.Job.getCompareCommits;
    internals.Job.getPullRequests = utils.Job.getPullRequests;
    internals.Job.getPullRequest = utils.Job.getPullRequest;
    internals.Job.deletePullRequest = utils.Job.deletePullRequest;
    internals.Job.startPullRequest = utils.Job.startPullRequest;
    internals.Job.mergePullRequest = utils.Job.mergePullRequest;
    internals.Job.getActiveJobs = utils.Job.getActiveJobs;
    internals.Job.getActivePullRequests = utils.Job.getActivePullRequests;
    internals.Job.getQueue = utils.Job.getQueue;
    internals.Job.addJob = utils.Job.addJob;
    internals.Job.removeJob = utils.Job.removeJob;
    internals.Job.clearQueue = utils.Job.clearQueue;
    internals.Job.getRunByName = utils.Job.getRunByName;
    this.startJob = exports.startJob;
    this.createJob = exports.createJob;
    this.deleteJob = exports.deleteJob;
    this.deleteWorkspace = exports.deleteWorkspace;
    this.updateJob = exports.updateJob;
    this.getJob = exports.getJob;
    this.getJobByName = exports.getJobByName;
    this.getJobs = exports.getJobs;
    this.getJobsStats = exports.getJobsStats;
    this.getAllCommits = exports.getAllCommits;
    this.getCompareCommits = exports.getCompareCommits;
    this.getPullRequests = exports.getPullRequests;
    this.getPullRequest = exports.getPullRequest;
    this.deletePullRequest = exports.deletePullRequest;
    this.startPullRequest = exports.startPullRequest;
    this.mergePullRequest = exports.mergePullRequest;
    this.mergePullRequest = exports.mergePullRequest;
    this.getQueue = exports.getQueue;
    this.addJob = exports.addJob;
    this.removeJob = exports.removeJob;
    this.clearQueue = exports.clearQueue;
    this.removePullRequest = exports.removePullRequest;
    this.getActiveJobs = exports.getActiveJobs;
    this.getActivePullRequests = exports.getActivePullRequests;
    //console.log(this);
};

exports.startJob = function (request, reply) {

    internals.Job.startJob(request.params.jobId, null, (response) => {

        return reply(response);
    });
};

exports.createJob = function (request, reply) {

    internals.Job.createJob(request.payload, (response) => {

        return reply(response);
    });
};

exports.deleteJob = function (request, reply) {

    const response = internals.Job.deleteJob(request.params.jobId);
    return reply(response);
};

exports.deleteWorkspace = function (request, reply) {

    const response = internals.Job.deleteWorkspace(request.params.jobId);
    return reply(response);
};

exports.updateJob = function (request, reply) {

    internals.Job.updateJob(request.params.jobId, request.payload, (response) => {

        return reply(response);
    });
};

exports.getJob = function (request, reply) {

    const response = internals.Job.getJob(request.params.jobId);
    return reply(response);
};

exports.getJobByName = function (request, reply) {

    const response = internals.Job.getJobByName(request.params.name);
    return reply(response);
};

exports.getJobs = function (request, reply) {

    const response = internals.Job.getJobs();
    return reply(response);
};

exports.getJobsStats = function (request, reply) {

    const fullJobs = [];
    const jobs = internals.Job.getJobs();
    for (let i = 0; i < jobs.length; ++i) {
        const job = jobs[i];
        job.lastRun = internals.Job.getRunByName(job.id, 'last');
        fullJobs.push(job);
    }
    return reply(fullJobs);
};

exports.getAllCommits = function (request, reply) {

    internals.Job.getAllCommits(request.params.jobId, (commits) => {

        return reply(commits);
    });
};

exports.getCompareCommits = function (request, reply) {

    internals.Job.getCompareCommits(request.params.jobId, request.payload.commit1, request.payload.commit2, (commits) => {

        return reply(commits);
    });
};

exports.getPullRequests = function (request, reply) {

    const token = internals.Job.settings.github.token;
    internals.Job.getPullRequests(request.params.jobId, token, (prs) => {

        return reply(prs);
    });
};

exports.getPullRequest = function (request, reply) {

    const token = internals.Job.settings.github.token;
    internals.Job.getPullRequest(request.params.jobId, request.params.number, token, (pr) => {

        return reply(pr);
    });
};

exports.deletePullRequest = function (request, reply) {

    internals.Job.deletePullRequest(request.params.jobId, request.params.number);
    return reply('');
};

exports.startPullRequest = function (request, reply) {

    const token = internals.Job.settings.github.token;
    internals.Job.getPullRequest(request.params.jobId, request.params.number, token, (pr) => {

        //const response = internals.Job.startJob(request.params.jobId, pr);
        const response = internals.Job.addJob(request.params.jobId, pr);
        return reply(response);
    });
};

exports.mergePullRequest = function (request, reply) {

    //const token = null;
    //console.log(request.headers);
    const token = request.headers.githubtoken;
    internals.Job.mergePullRequest(request.params.jobId, request.params.number, token, (result) => {

        return reply(result);
    });
};

exports.getQueue = function (request, reply) {

    const response = internals.Job.getQueue();
    return reply(response);
};

exports.addJob = function (request, reply) {

    internals.Job.addJob(request.payload.jobId, null);
    return reply();
};

exports.removeJob = function (request, reply) {

    internals.Job.removeJob(request.params.jobId, null);
    return reply();
};

exports.clearQueue = function (request, reply) {

    internals.Job.clearQueue();
    return reply();
};

exports.removePullRequest = function (request, reply) {

    internals.Job.removeJob(request.params.jobId, request.params.number);
    return reply();
};

exports.getActiveJobs = function (request, reply) {

    const active = internals.Job.getActiveJobs();
    return reply(active);
};

exports.getActivePullRequests = function (request, reply) {

    const active = internals.Job.getActivePullRequests();
    return reply(active);
};
