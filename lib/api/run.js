var Runner = require('../runner');
var Fs = require('fs');
var Store = require('../store/file');
var Pail = require('pail').pail;

var internals = {
    defaults: {
        jobPath: '/tmp/tacklebox/job'
    }
};

exports.startRun = function (request, reply) {

   var reel = request.server.plugins.reel;
   //console.log(reel);
   var reelReply = function (result, err) {
       //if (err) {
       //    console.log(err);
       //}
       //else {
           console.log('run result');
           console.log(result);
       //}
   }
   var pail = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   //console.log('run pail id: ' + pail.id);
   //var reelConfig = reel.getReel(request, reelReply);
   //reel.startReel(request, reelReply);
   //console.log('id: ' + createReelConfig.id);
   var run_id = Runner.start(request.params.job_id);
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

    var file = Store.getConsoleLog(request.params.job_id, request.params.run_id);
    var response = {
        job_id: request.params.job_id,
        run_id: request.params.run_id,
        console: file
    }
    reply(response);
};

exports.getRun = function (request, reply) {
    
    var config = Store.getRunConfig(request.params.job_id, request.params.run_id);
    config.elapsedTime = config.finishTime - request.params.run_id;
    reply(config);
};

exports.getRuns = function (request, reply) {

   var runs = Store.getRuns(request.params.job_id);
   reply(runs);
};

exports.deleteRun = function (request, reply) {

   //Pail.deletePail(internals.defaults.runPath, request.params.run_id);
   Store.deleteRun(request.params.job_id, request.params.run_id);
   reply('deleted');
};
