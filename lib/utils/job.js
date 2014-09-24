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

exports.createJob = function (config) {

   var jobConfig = {
       name: config.name,
       description: config.description,
       scm: config.scm,
       head: config.head,
       body: config.body,
       tail: config.tail,
       runs: [],
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

exports.deleteJob = function (job_id) {

   var jobPail = new Pail(internals.Job.settings.job);
   var job = jobPail.getPail(job_id);
   for (var i = 0; i < job.runs.length; i++) {

      this.settings.plugins.reel.deleteRun(job.runs[i]);
   }
   //jobPail.unlinkPail(job.name);
   jobPail.deletePail(job_id);
   return null;
};

exports.updateJob = function (job_id, payload) {

   var jobPail = new Pail(internals.Job.settings.job);
   var pail = jobPail.getPail(job_id);
   // i could delete it later, but then id have to reget the config all over again so quicker i think to just delete and redo symlink
   //jobPail.unlinkPail(pail.name);
   var config = Hoek.applyToDefaults(pail, payload);
   config.updateTime = new Date().getTime();
   var updatedPail = jobPail.savePail(config);
   //jobPail.linkPail(updatedPail.id, updatedPail.name);
   return config;
};

exports.getJob = function (job_id) {

   var jobPail = new Pail(internals.Job.settings.job);
   var config = jobPail.getPail(job_id);
   return config;
};

exports.getJobs = function () {

   var jobPail = new Pail(internals.Job.settings.job);
   var jobs = jobPail.getPails();
   return jobs;
};
