var Utils = require('../utils');

var internals = {};

module.exports = internals.Job = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.Job.settings = this.settings;
    internals.Job.createJob = utils.Job.createJob;
    internals.Job.deleteJob = utils.Job.deleteJob;
    internals.Job.updateJob = utils.Job.updateJob;
    internals.Job.getJob = utils.Job.getJob;
    internals.Job.getJobByLink = utils.Job.getJobByLink;
    internals.Job.getJobs = utils.Job.getJobs;
    this.createJob = exports.createJob;
    this.deleteJob = exports.deleteJob;
    this.updateJob = exports.updateJob;
    this.getJob = exports.getJob;
    this.getJobByLink = exports.getJobByLink;
    this.getJobs = exports.getJobs;
    //console.log(this);
};

exports.createJob = function (request, reply) {
   
   var response = internals.Job.createJob(request.payload);
   reply(response);
};

exports.deleteJob = function (request,reply) {

   var response = internals.Job.deleteJob(request.params.job_id);
   reply(response);
};

exports.updateJob = function (request, reply) {

   var response = internals.Job.updateJob(request.params.job_id, request.payload);
   reply(response);
};

exports.getJob = function (request, reply) {

   var response = internals.Job.getJob(request.params.job_id);
   reply(response);
};

exports.getJobByLink = function (request, reply) {

   var response = internals.Job.getJobByLink(request.params.link);
   reply(response);
};

exports.getJobs = function (request, reply) {

   var response = internals.Job.getJobs();
   reply(response);
};
