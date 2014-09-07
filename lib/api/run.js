var Runner = require('../runner');
var Fs = require('fs');
var Store = require('../store/file');
var Reel = require('reel');

exports.startRun = function (request, reply) {

   // integration point for reel
   //var config = Store.getJobConfig(request.params.job_id);
   //console.log(config);
   //var payload = { commands: config.command };
   //console.log(payload);
   //var run_id = null;
   // do i call an expose function here from reel or a Wreck request?
   //var run_id = Reel.createReel(request, reply);
   //console.log(run_id);
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

   Store.deleteRun(request.params.job_id, request.params.run_id);
   reply('deleted');
};
