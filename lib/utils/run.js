var Pail = require('pail');
var Bobber = require('bobber');

var internals = {};

module.exports = internals.Run = function (options) {

    this.settings = options;
    internals.Run.settings = this.settings;
    this.startRun = exports.startRun;
    this.deleteRun = exports.deleteRun;
    this.getRun = exports.getRun;
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
          commands.push(bobber.getCheckoutCommand(internals.Run.settings.run.dirpath, job.scm));
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
   var createConfig = internals.Run.settings.plugins.reel.createRun(commands);
   //console.log('running id: ' + createConfig.id);
   var run_id = internals.Run.settings.plugins.reel.startRun(createConfig.id);
   var updateJob = job;
   updateJob.runs.push(run_id);
   var updateConfig = jobPail.updatePail(updateJob);
   return { id: run_id };
};
/*

exports.cancelRun = function (job_id, run_id) {

   // how should i interrupt a job?
   // need to check elapsed time after it has been successfully stopped
   var response = {
       job_id: job_id,
       run_id: run_id,
       status: 'cancelled',
       elapsed: 'time',
       created: 'time'
   }
   return response;
};

exports.getConsole = function (job_id, run_id) {

    var response = {
        job_id: job_id,
        run_id: run_id
        //console: file
    }
    return response;
};

*/
exports.getRun = function (run_id) {

    var run = internals.Run.settings.plugins.reel.getRun(run_id);
    run.elapsedTime = run.finishTime - run.startTime;
    return run;
};

exports.getRuns = function (job_id) {

    var runs = internals.Run.settings.plugins.reel.getRuns();
    return runs;
};

exports.deleteRun = function (job_id, run_id) {

    var jobPail = new Pail(internals.Run.settings.job);
    var job = jobPail.getPail(job_id);
    var runs = job.runs;
    internals.Run.settings.plugins.reel.deleteRun(run_id);
    var index = runs.indexOf(run_id);
   //if (index !== -1) {
      runs.splice(index, 1);
   //}
    job.runs = runs;
    jobPail.updatePail(job);
    return null;
};
