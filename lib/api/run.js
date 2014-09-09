var Fs = require('fs');
var Pail = require('pail').pail;
var Bobber = require('bobber').bobber;

var internals = {
    defaults: {
        jobPath: '/tmp/tacklebox/job',
        runPath: '/tmp/reel'
    }
};

exports.startRun = function (request, reply) {

   var job = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   //console.log(job);
   var reel = request.server.plugins.reel;
   var commands = [];

   if (job.scm) {
      // need some logic to implement scm type but for now lets just assume git
      console.log('type: ' + job.scm.type);
      if (job.scm.type === 'git' ) {
          commands.push(Bobber.getCheckoutCommand(internals.defaults.runPath, job.scm));
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
   var reelConfig = {
       payload: {
           commands: commands
       }
   };
   var reelConfig = {
       payload: {
           commands: commands
       }
   };
   var createConfig = {};
   var createReply = function (result, err) {
       //if (err) {
       //    console.log(err);
       //}
       //else {
           createConfig = result;
       //}
   }
   reel.createReel(reelConfig, createReply);
   var runConfig = {};
   var runReply = function (result, err) {
       //if (err) {
           //console.log(err);
       //}
       //else {
           runConfig = result;
       //}
   }
   request.params.id = createConfig.id;
   console.log('running id: ' + createConfig.id);
   reel.startReel(request, runReply);
   var run_id = runConfig.id;
   var saveJob = job;
   saveJob.runs.push(run_id);
   var saveConfig = Pail.savePail(internals.defaults.jobPath, saveJob);
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

    var config = Pail.getPail(internals.defaults.runPath, request.params.run_id);
    config.elapsedTime = config.finishTime - request.params.run_id;
    reply(config);
};

exports.getRuns = function (request, reply) {

   var job = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   reply(job.runs);
};

exports.deleteRun = function (request, reply) {

   var job = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   var runs = job.runs;
   Pail.deletePail(internals.defaults.runPath, request.params.run_id);
   var index = runs.indexOf(request.params.run_id);
   //if (index !== -1) {
      runs.splice(index, 1);
   //}
   job.runs = runs;
   Pail.savePail(internals.defaults.jobPath, job);
   reply('deleted');
};
