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


exports.startRun = function (job_id) {

   var jobPail = new Pail(internals.Run.settings.job);
   var job = jobPail.getPail(job_id);
   //console.log(job);
   var commands = [];

   if (job.scm) {
      // need some logic to implement scm type but for now lets just assume git
      if (job.scm.type === 'git' ) {
          var bobber = new Bobber;
          //commands.push(bobber.getCheckoutCommand(internals.Run.settings.run.dirpath, job.scm));
          commands.push(bobber.getCheckoutCommand(internals.Run.settings.job.dirpath + '/' + job_id + '/runs', job.scm));
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
   internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + job_id + '/runs';
   //console.log(internals.Run.settings.plugins.reel);
   var createConfig = internals.Run.settings.plugins.reel.createRun(commands);
   //console.log('running id: ' + createConfig.id);
   var run_id = internals.Run.settings.plugins.reel.startRun(createConfig.id);
   var updateJob = job;
   //updateJob.runs.push(run_id);
   var updateConfig = jobPail.updatePail(updateJob);
   return { id: run_id };
};

/*
exports.getConsole = function (job_id, run_id) {

    var response = {
        job_id: job_id,
        run_id: run_id
        //console: file
    }
    return response;
};

*/
exports.getRun = function (job_id, run_id) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + job_id + '/runs';
    var run = internals.Run.settings.plugins.reel.getRun(run_id);
    run.elapsedTime = run.finishTime - run.startTime;
    return run;
};

exports.cancelRun = function (job_id, run_id) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + job_id + '/runs';
    internals.Run.settings.plugins.reel.cancelRun(run_id);
    return null;
};

exports.getRunPids = function (job_id, run_id) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + job_id + '/runs';
    var pids = internals.Run.settings.plugins.reel.getRunPids(run_id);
    return pids;
};

exports.getRuns = function (job_id) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + job_id + '/runs';
    var runs = internals.Run.settings.plugins.reel.getRuns();
    var fullRuns = [];
    for (var i = 0; i < runs.length; i++) {
        var run = internals.Run.getRun(job_id, runs[i]);
        fullRuns.push(run);
    }
    // sort by createTime
    fullRuns.sort(function(a, b){

       return b.createTime-a.createTime;
    });
    return fullRuns;
};

exports.deleteRun = function (job_id, run_id) {

    var jobPail = new Pail(internals.Run.settings.job);
    var job = jobPail.getPail(job_id);
    var runs = job.runs;
    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + job_id + '/runs';
    internals.Run.settings.plugins.reel.deleteRun(run_id);
    jobPail.updatePail(job);
    return null;
};

exports.getRunByLink = function (job_id, link) {

    internals.Run.settings.plugins.reel.settings.reel.dirpath = internals.Run.settings.job.dirpath + '/' + job_id + '/runs';
    var run = internals.Run.settings.plugins.reel.getRunByLink(link);
    return run;
};
