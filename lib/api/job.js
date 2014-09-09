var Boom = require('boom');
var Fs = require('fs');
var Hoek = require('hoek');
var Pail = require('pail').pail;

var internals = {
    defaults: {
        jobPath: '/tmp/tacklebox/job',
        runPath: '/tmp/reel'
    }
};

exports.createJob = function (request, reply) {

/*
   var commands = [];
   if (request.payload.head) {
       commands.push(request.payload.head);
   }
   //if (request.payload.body) {
       commands.push(request.payload.body);
   //}
   if (request.payload.tail) {
       commands.push(request.payload.tail);
   }
   var reelConfig = {
       payload: {
           commands: commands
       }
   };

   var reel = request.server.plugins.reel;
   //console.log(reel);
   //console.log(reelConfig);
   var createReelConfig = {};
   var reelReply = function (result, err) {
       //if (err) {
       //    console.log(err);
       //}
       //else {
           createReelConfig = result;
       //}
   }
   reel.createReel(reelConfig, reelReply);
   //console.log('id: ' + createReelConfig.id);
*/

   var config = {
       name: request.payload.name,
       //reel_id: createReelConfig.id,
       scm: request.payload.scm,
       head: request.payload.head,
       body: request.payload.body,
       tail: request.payload.tail,
       runs: [],
       status: 'created',
       notify: { type: 'email', 
                 email: 'lloyd.benson@gmail.com'
               },
       created: new Date().getTime()
   };

   var pail = Pail.savePail(internals.defaults.jobPath, config);
   Pail.linkPail(internals.defaults.jobPath, pail.id, pail.name);
   //console.log('pail id: ' + pail.id);
   //if (result.err) {
       //Boom.badRequest(result.err);
   //    reply(result);
   //}
   //else {
       //reply(result);
       reply(pail);
   //}
};

exports.deleteJob = function (request,reply) {

   var job = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   for (var i = 0; i < job.runs.length; i++) {

      Pail.deletePail(internals.defaults.runPath, job.runs[i]);
   }
   Pail.unlinkPail(internals.defaults.jobPath, job.name);
   Pail.deletePail(internals.defaults.jobPath, request.params.job_id);
   reply('deleted');
};

exports.updateJob = function (request, reply) {

   var pail = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   // i could delete it later, but then id have to reget the config all over again so quicker i think to just delete and redo symlink
   Pail.unlinkPail(internals.defaults.jobPath, pail.name);
   var config = Hoek.applyToDefaults(pail, request.payload);
   config.updateTime = new Date().getTime();
   var updatedPail = Pail.savePail(internals.defaults.jobPath, config);
   Pail.linkPail(internals.defaults.jobPath, updatedPail.id, updatedPail.name);
   reply(config);
};

exports.getJob = function (request, reply) {

    var config = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
    reply(config);
};

exports.getJobs = function (request, reply) {

   var jobs = Pail.getPails(internals.defaults.jobPath);
   reply(jobs);
};
