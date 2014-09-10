var Fs = require('fs');
var Pail = require('pail');
var Bobber = require('bobber').bobber;

var internals = {
    defaults: {
        job: {
            pailPath: '/tmp/tacklebox/job',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        run: {
            pailPath: '/tmp/reel',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};

var jobPail = new Pail(internals.defaults.job);
var runPail = new Pail(internals.defaults.run);

exports.startRun = function (request, reply) {

   var job = jobPail.getPail(request.params.job_id);
   //console.log(job);
   var reel = request.server.plugins.reel;
   var commands = [];

   if (job.scm) {
      // need some logic to implement scm type but for now lets just assume git
      console.log('type: ' + job.scm.type);
      if (job.scm.type === 'git' ) {
          commands.push(Bobber.getCheckoutCommand(internals.defaults.run.pailPath, job.scm));
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

    var config = runPail.getPail(request.params.run_id);
    config.elapsedTime = config.finishTime - request.params.run_id;
    reply(config);
};

exports.getRuns = function (request, reply) {

   var job = jobPail.getPail(request.params.job_id);
   reply(job.runs);
};

exports.deleteRun = function (request, reply) {

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
