var Utils = require('../utils');

var internals = {};

module.exports = internals.Run = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.Run.settings = this.settings;
    internals.Run.startRun = utils.Run.startRun;
    internals.Run.deleteRun = utils.Run.deleteRun;
    internals.Run.getRun = utils.Run.getRun;
    internals.Run.cancelRun = utils.Run.cancelRun;
    internals.Run.getRunPids = utils.Run.getRunPids;
    internals.Run.getRuns = utils.Run.getRuns;
    internals.Run.getRunByLink = utils.Run.getRunByLink;
    this.startRun = exports.startRun;
    this.deleteRun = exports.deleteRun;
    this.getRun = exports.getRun;
    this.getRunPids = exports.getRunPids;
    this.getRuns = exports.getRuns;
    this.getRunByLink = exports.getRunByLink;
    this.cancelRun = exports.cancelRun;
    //console.log(this);
};


exports.startRun = function (request, reply) {
   
   var response = internals.Run.startRun(request.params.job_id);
   reply(response);
};

exports.cancelRun = function (request, reply) {

   var response = internals.Run.cancelRun(request.params.job_id, request.params.run_id);
   reply(response);
};

/*

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

exports.getRunPids = function (request, reply) {

   var response = internals.Run.getRunPids(request.params.job_id, request.params.run_id);
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

exports.getRunByLink = function (request, reply) {

   var response = internals.Run.getRunByLink(request.params.job_id, request.params.link);
   reply(response);
};
