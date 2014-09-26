var Utils = require('../utils');

var internals = {};

module.exports = internals.Run = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.Run.settings = this.settings;
    internals.Run.startRun = utils.Run.startRun;
    internals.Run.deleteRun = utils.Run.deleteRun;
    internals.Run.getRun = utils.Run.getRun;
    internals.Run.getRuns = utils.Run.getRuns;
    this.startRun = exports.startRun;
    this.deleteRun = exports.deleteRun;
    this.getRun = exports.getRun;
    this.getRuns = exports.getRuns;
    //console.log(this);
};


exports.startRun = function (request, reply) {
   
   var response = internals.Run.startRun(request.params.job_id);
   reply(response);
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

   var response = internals.Run.getRun(request.params.job_id, request.params.run_id);
   reply(response);
};

exports.getRuns = function (request, reply) {

   var response = internals.Run.getRuns(request.params.job_id);
   reply(response);
};

exports.deleteRun = function (request, reply) {

   var response = internals.Run.deleteRun(request.params.job_id, request.params.run_id);
   reply(response);
};
