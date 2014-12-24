var Pail = require('pail');
var Bobber = require('bobber');

var internals = {};

module.exports = internals.Run = function (options) {

    this.settings = options;
    internals.Run.settings = this.settings;
    internals.Run.getRun = exports.getRun;
    this.startRun = exports.startRun;
    this.deleteRun = exports.deleteRun;
    this.getRun = exports.getRun;
    this.getRunByLink = exports.getRunByLink;
    this.cancelRun = exports.cancelRun;
    this.getRunPids = exports.getRunPids;
    this.getRuns = exports.getRuns;
    //console.log(this);
};


exports.startRun = function (jobId) {

   var jobPail = new Pail(internals.Run.settings.job);
   var job = jobPail.getPail(jobId);
   //console.log(job);
   var commands = [];

   if (job.scm) {
      // need some logic to implement scm type but for now lets just assume git
      if (job.scm.type === 'git' ) {
          var bobber = new Bobber;
          //commands.push(bobber.getCheckoutCommand(internals.Run.settings.run.dirpath, job.scm));
          commands.push(bobber.getCheckoutCommand(internals.Run.settings.job.dirpath + '/' + jobId + '/runs/' + internals.Run.settings.job.workspace , job.scm));
      }
      else {
          // ignore
      }
   }
   if (job.head) {
       commands.push(job.head);
   }
   //if (job.body) {
       commands.push(job.body);
   //}
   if (job.tail) {
       commands.push(job.tail);
   }
   internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + jobId + '/runs';
   //console.log(internals.Run.settings.plugins.reel);
   var createConfig = internals.Run.settings.plugins.reel.createRun(commands);
   //console.log('running id: ' + createConfig.id);
   var runId = internals.Run.settings.plugins.reel.startRun(createConfig.id);
   var updateJob = job;
   //updateJob.runs.push(runId);
   var updateConfig = jobPail.updatePail(updateJob);
   return { id: runId };
};

/*
exports.getConsole = function (jobId, runId) {

    var response = {
        jobId: jobId,
        runId: runId
        //console: file
    }
    return response;
};

*/
exports.getRun = function (jobId, runId) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + jobId + '/runs';
    var run = internals.Run.settings.plugins.reel.getRun(runId);
    run.elapsedTime = run.finishTime - run.startTime;
    return run;
};

exports.cancelRun = function (jobId, runId) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + jobId + '/runs';
    internals.Run.settings.plugins.reel.cancelRun(runId);
    return null;
};

exports.getRunPids = function (jobId, runId) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + jobId + '/runs';
    var pids = internals.Run.settings.plugins.reel.getRunPids(runId);
    return pids;
};

exports.getRuns = function (jobId) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + jobId + '/runs';
    var runs = internals.Run.settings.plugins.reel.getRuns();
    var fullRuns = [];
    for (var i = 0; i < runs.length; i++) {
        var run = internals.Run.getRun(jobId, runs[i]);
        fullRuns.push(run);
    }
    // sort by createTime
    fullRuns.sort(function(a, b){

       return b.createTime-a.createTime;
    });
    return fullRuns;
};

exports.deleteRun = function (jobId, runId) {

    var jobPail = new Pail(internals.Run.settings.job);
    var job = jobPail.getPail(jobId);
    var runs = job.runs;
    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + jobId + '/runs';
    internals.Run.settings.plugins.reel.deleteRun(runId);
    jobPail.updatePail(job);
    return null;
};

exports.getRunByLink = function (jobId, link) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + jobId + '/runs';
    var run = internals.Run.settings.plugins.reel.getRunByLink(link);
    return run;
};
