var Boom = require('boom');
var Fs = require('fs');
var Hoek = require('hoek');
var Store = require('../store/file');
var Pail = require('pail').pail;

var internals = {
    defaults: {
        jobPath: '/tmp/tacklebox/job'
    }
};

exports.createJob = function (request, reply) {

   var commands = [];
   if (request.payload.pre) {
       commands.push(request.payload.pre);
   }
   if (request.payload.command) {
       commands.push(request.payload.command);
   }
   if (request.payload.post) {
       commands.push(request.payload.post);
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

   var config = {
       name: request.payload.name,
       reel_id: createReelConfig.id,
       job_id: createReelConfig.id,
       scm: request.payload.scm,
       pre: request.payload.pre,
       command: request.payload.command,
       post: request.payload.post,
       notify: { type: 'email', 
                 email: 'lloyd.benson@gmail.com'
               },
       created: new Date().getTime()
   };
   //var result = Store.saveJobConfig(config, null);

   var jobConfig = {
       name: request.payload.name,
       scm: request.payload.scm,
       pre: request.payload.pre,
       command: request.payload.command,
       post: request.payload.post,
       job_id: request.params.job_id,
       reel_id: createReelConfig.id,
       status: 'created',
       notify: { type: 'email', 
                 email: 'lloyd.benson@gmail.com'
               }
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
   // need to make it so runs is no longer there before i can remove store
   //var pail = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   //Pail.unlinkPail(internals.defaults.jobPath, pail.name);
   //Pail.deletePail(internals.defaults.jobPath, pail.id);
   Store.deleteJob(request.params.job_id);
   reply('deleted');
};

exports.updateJob = function (request, reply) {

   var pail = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
   //var origConfig = Store.getJobConfig(request.params.job_id);
   // i could delete it later, but then id have to reget the config all over again so quicker i think to just delete and redo symlink
   Pail.unlinkPail(internals.defaults.jobPath, pail.name);
   //Store.deleteJobLabel(origConfig.name);
   //var config = Hoek.applyToDefaults(origConfig, request.payload);
   var config = Hoek.applyToDefaults(pail, request.payload);
   config.updateTime = new Date().getTime();
   //Store.saveJobConfig(config, request.params.job_id);
   var updatedPail = Pail.savePail(internals.defaults.jobPath, config);
   Pail.linkPail(internals.defaults.jobPath, updatedPail.id, updatedPail.name);
   reply(config);
};

exports.getJob = function (request, reply) {

    var config = Pail.getPail(internals.defaults.jobPath, request.params.job_id);
    //console.log('getJob: ' + JSON.stringify(pail));
    //var config = Store.getJobConfig(request.params.job_id);
    reply(config);
};

exports.getJobs = function (request, reply) {

   var jobs = Pail.getPails(internals.defaults.jobPath);
   //console.log(pails);
   //var jobs = Store.getJobs();
   reply(jobs);
};
