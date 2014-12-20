var Hoek = require('hoek');
var Pail = require('pail');

var internals = {};

module.exports = internals.Job = function (options) {

    this.settings = options;
    internals.Job.settings = this.settings;
    internals.Job.getJob = exports.getJob;
    this.createJob = exports.createJob;
    this.deleteJob = exports.deleteJob;
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
       scm: config.scm,
       head: config.head,
       body: config.body,
       tail: config.tail,
//       runs: [],
       status: 'created',
       notify: { type: 'email', 
                 email: 'lloyd.benson@gmail.com'
               },
       created: new Date().getTime()
   };
   var jobPail = new Pail(internals.Job.settings.job);
   var pail = jobPail.createPail(jobConfig);
   //jobPail.linkPail(pail.id, pail.name);
   //console.log('pail id: ' + pail.id);
   return pail;
};

exports.deleteJob = function (jobId) {

   var jobPail = new Pail(internals.Job.settings.job);
   var job = jobPail.getPail(jobId);
/*
   for (var i = 0; i < job.runs.length; i++) {

      internals.Job.settings.plugins.reel.settings.reel.dirpath = internals.Job.settings.job.dirpath + '/' + jobId + '/runs';
      this.settings.plugins.reel.deleteRun(job.runs[i]);
   }
*/
   //jobPail.unlinkPail(job.name);
   jobPail.deletePail(jobId);
   return null;
};

exports.updateJob = function (jobId, payload) {

   var jobPail = new Pail(internals.Job.settings.job);
   var pail = jobPail.getPail(jobId);
   // i could delete it later, but then id have to reget the config all over again so quicker i think to just delete and redo symlink
   //jobPail.unlinkPail(pail.name);
   var config = Hoek.applyToDefaults(pail, payload);
   config.updateTime = new Date().getTime();
   var updatedPail = jobPail.updatePail(config);
   //jobPail.linkPail(updatedPail.id, updatedPail.name);
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
