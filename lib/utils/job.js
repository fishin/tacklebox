var Hoek = require('hoek');
var Pail = require('pail');

var internals = {};

module.exports = internals.Job = function (options) {

    internals.Job.settings = options;
    internals.Job.getJob = exports.getJob;
    this.createJob = exports.createJob;
    this.deleteJob = exports.deleteJob;
    internals.Job.deleteWorkspace = exports.deleteWorkspace;
    this.deleteWorkspace = exports.deleteWorkspace;
    this.getWorkspaceArtifact = exports.getWorkspaceArtifact;
    this.updateJob = exports.updateJob;
    this.getJob = exports.getJob;
    this.getJobByLink = exports.getJobByLink;
    this.getJobs = exports.getJobs;
    //console.log(this);
};

exports.createJob = function (config) {

   var jobConfig = {
       name: config.name,
       description: config.description,
       head: config.head,
       scm: config.scm,
       body: config.body,
       tail: config.tail,
       status: 'created',
       notify: { type: 'email', 
                 email: 'lloyd.benson@gmail.com'
               },
       created: new Date().getTime()
   };
   config.created = new Date().getTime();
   config.status = 'created';
   var jobPail = new Pail(internals.Job.settings.job);
   //var pail = jobPail.createPail(jobConfig);
   var pail = jobPail.createPail(config);
   //console.log('pail id: ' + pail.id);
   return pail;
};

exports.deleteJob = function (jobId) {

   var jobPail = new Pail(internals.Job.settings.job);
   var job = jobPail.getPail(jobId);
   jobPail.deletePail(jobId);
   return null;
};

exports.deleteWorkspace = function (jobId) {

    internals.Job.settings.plugins.reel.settings.dirPath = internals.Job.settings.job.dirPath + '/' + jobId + '/runs';
    internals.Job.settings.plugins.reel.deleteWorkspace();
    return null;
};

exports.getWorkspaceArtifact = function (jobId, artifact) {

    internals.Job.settings.plugins.reel.settings.dirPath = internals.Job.settings.job.dirPath + '/' + jobId + '/runs';
    var contents = internals.Job.settings.plugins.reel.getWorkspaceArtifact(artifact);
    return contents;
};

exports.updateJob = function (jobId, payload) {

   var jobPail = new Pail(internals.Job.settings.job);
   var pail = jobPail.getPail(jobId);
   // if url or branch change deleteWorkspace
   // I could maybe just have a blank scm?
   if (pail.scm && pail.scm.url !== payload.scm.url) {
       internals.Job.deleteWorkspace(jobId);
   }
   if (pail.scm && pail.scm.branch !== payload.scm.branch) {
       internals.Job.deleteWorkspace(jobId);
   }
   var config = Hoek.applyToDefaults(pail, payload);
   config.updateTime = new Date().getTime();
   var updatedPail = jobPail.updatePail(config);
   return config;
};

exports.getJob = function (jobId) {

   var jobPail = new Pail(internals.Job.settings.job);
   var config = jobPail.getPail(jobId);
   return config;
};

exports.getJobByLink = function (link) {

   var jobPail = new Pail(internals.Job.settings.job);
   var jobId = jobPail.getPailByLink(link);
   var config = internals.Job.getJob(jobId);
   return config;
};

exports.getJobs = function () {

   var jobPail = new Pail(internals.Job.settings.job);
   var jobs = jobPail.getPails();
   var fullJobs = [];
   for (var i = 0; i < jobs.length; i++) {
       var job = internals.Job.getJob(jobs[i]);
       fullJobs.push(job);
   }
   // sort by createTime
   fullJobs.sort(function(a, b){

      return a.createTime-b.createTime;
   });
   return fullJobs;
};
