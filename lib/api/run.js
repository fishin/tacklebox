var Fs = require('fs');
var Pail = require('pail');
var Bobber = require('bobber').bobber;

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


exports.startRun = function (request, reply) {

   var jobPail = new Pail(internals.Run.settings.job);
   var job = jobPail.getPail(request.params.job_id);
   //console.log(job);
   var commands = [];

   if (job.scm) {
      // need some logic to implement scm type but for now lets just assume git
      if (job.scm.type === 'git' ) {
          commands.push(Bobber.getCheckoutCommand(internals.Run.settings.run.pailPath, job.scm));
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
   var reel = request.server.plugins.reel;
   var createConfig = reel.createReel(commands);
   request.params.id = createConfig.id;
   console.log('running id: ' + createConfig.id);
   var runConfig = reel.startReel(createConfig.id);
   var run_id = runConfig.id;
   var saveJob = job;
   saveJob.runs.push(run_id);
   var saveConfig = jobPail.savePail(saveJob);
   reply( { job_id: request.params.job_id, run_id: run_id } );
};
/*

exports.cancelRun = function (request, reply) {

   // how should i interrupt a job?
   // need to check elapsed time after it has been successfully stopped
   var response = {
       job_id: request.params.job_id,
       run_id: request.params.run_id,
       status: 'cancelled',
       elapsed: 'time',
       created: 'time'
   }
   reply(response);
};

exports.getConsole = function (request, reply) {

    var response = {
        job_id: request.params.job_id,
        run_id: request.params.run_id
        //console: file
    }
    reply(response);
};

*/
exports.getRun = function (request, reply) {

    var runPail = new Pail(internals.Run.settings.run);
    var config = runPail.getPail(request.params.run_id);
    config.elapsedTime = config.finishTime - request.params.run_id;
    reply(config);
};

exports.getRuns = function (request, reply) {

   var jobPail = new Pail(internals.Run.settings.job);
   var job = jobPail.getPail(request.params.job_id);
   reply(job.runs);
};

exports.deleteRun = function (request, reply) {

   var jobPail = new Pail(internals.Run.settings.job);
   var runPail = new Pail(internals.Run.settings.run);
   var job = jobPail.getPail(request.params.job_id);
   var runs = job.runs;
   runPail.deletePail(request.params.run_id);
   var index = runs.indexOf(request.params.run_id);
   //if (index !== -1) {
      runs.splice(index, 1);
   //}
   job.runs = runs;
   jobPail.savePail(job);
   reply('deleted');
};
