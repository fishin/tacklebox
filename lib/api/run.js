var Fs = require('fs');
var Pail = require('pail').pail;

var internals = {
    defaults: {
        jobPath: '/tmp/tacklebox/job',
        runPath: '/tmp/reel'
    }
};

exports.startRun = function (request, reply) {

   var reel = request.server.plugins.reel;
   //console.log(reel);
   var runConfig = {};
   var reelReply = function (result, err) {
       if (err) {
           //console.log(err);
       }
       else {
           runConfig = result;
       }
   }
   var pail = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   console.log('run pail id: ' + pail.id);
   request.params.id = pail.reel_id;
   reel.startReel(request, reelReply);
   var run_id = runConfig.id;
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
*/

exports.getConsole = function (request, reply) {

    var response = {
        job_id: request.params.job_id,
        run_id: request.params.run_id
        //console: file
    }
    reply(response);
};

exports.getRun = function (request, reply) {

    var config = Pail.getPail(internals.defaults.runPath, request.params.run_id);
    config.elapsedTime = config.finishTime - request.params.run_id;
    reply(config);
};

exports.getRuns = function (request, reply) {

   var runs = Pail.getPails(internals.defaults.jobPath, request.params.job_id);
   reply(runs);
};

exports.deleteRun = function (request, reply) {

   Pail.deletePail(internals.defaults.runPath, request.params.run_id);
   reply('deleted');
};
