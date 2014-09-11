var Boom = require('boom');
var Fs = require('fs');
var Hoek = require('hoek');
var Pail = require('pail');

var internals = {};

module.exports = internals.Job = function (options) {

    this.settings = options;
    internals.Job.settings = this.settings;
    this.createJob = exports.createJob;
    this.deleteJob = exports.deleteJob;
    this.updateJob = exports.updateJob;
    this.getJob = exports.getJob;
    this.getJobs = exports.getJobs;
    //console.log(this);
};

exports.createJob = function (request, reply) {

   var config = {
       name: request.payload.name,
       //reel_id: createReelConfig.id,
       scm: request.payload.scm,
       head: request.payload.head,
       body: request.payload.body,
       tail: request.payload.tail,
       runs: [],
       status: 'created',
       notify: { type: 'email', 
                 email: 'lloyd.benson@gmail.com'
               },
       created: new Date().getTime()
   };
   var jobPail = new Pail(internals.Job.settings.job);
   var pail = jobPail.savePail(config);
   jobPail.linkPail(pail.id, pail.name);
   //console.log('pail id: ' + pail.id);
   //if (result.err) {
       //Boom.badRequest(result.err);
   //    reply(result);
   //}
   //else {
       //reply(result);
       reply(pail);
   //}
};

exports.deleteJob = function (request,reply) {

   var jobPail = new Pail(internals.Job.settings.job);
   var runPail = new Pail(internals.Job.settings.run);
   var job = jobPail.getPail(request.params.job_id);
   for (var i = 0; i < job.runs.length; i++) {
      runPail.deletePail(job.runs[i]);
   }
   jobPail.unlinkPail(job.name);
   jobPail.deletePail(request.params.job_id);
   reply('deleted');
};

exports.updateJob = function (request, reply) {

   var jobPail = new Pail(internals.Job.settings.job);
   var pail = jobPail.getPail(request.params.job_id);
   // i could delete it later, but then id have to reget the config all over again so quicker i think to just delete and redo symlink
   jobPail.unlinkPail(pail.name);
   var config = Hoek.applyToDefaults(pail, request.payload);
   config.updateTime = new Date().getTime();
   var updatedPail = jobPail.savePail(config);
   jobPail.linkPail(updatedPail.id, updatedPail.name);
   reply(config);
};

exports.getJob = function (request, reply) {

   var jobPail = new Pail(internals.Job.settings.job);
    var config = jobPail.getPail(request.params.job_id);
    reply(config);
};

exports.getJobs = function (request, reply) {

   var jobPail = new Pail(internals.Job.settings.job);
   var jobs = jobPail.getPails();
   reply(jobs);
};
