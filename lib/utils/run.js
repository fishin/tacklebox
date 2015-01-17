var Bait = require('bait');
var Bobber = require('bobber');
var Hoek = require('hoek');
var Pail = require('pail');

var internals = {};

module.exports = internals.Run = function (options) {

    internals.Run.settings = options;
    internals.Run.getRun = exports.getRun;
    this.startRun = exports.startRun;
    this.deleteRun = exports.deleteRun;
    this.getRun = exports.getRun;
    this.getRunByLink = exports.getRunByLink;
    this.cancelRun = exports.cancelRun;
    this.getRunPids = exports.getRunPids;
    this.getRuns = exports.getRuns;
};


exports.startRun = function (jobId) {

    var jobPail = new Pail(internals.Run.settings.job);
    var job = jobPail.getPail(jobId);
    //console.log(job);
    var commands = [];
    var runsDir = internals.Run.settings.job.dirPath + '/' + jobId + '/runs';
    var bait = new Bait({ dirPath: runsDir });

    Hoek.merge(commands, job.head);
    var checkoutCommands = [];
    if (job.scm) {
       // need some logic to implement scm type but for now lets just assume git
       if (job.scm.type === 'git' ) {
           var bobber = new Bobber;
           //console.log(internals.Run.settings.plugins.reel.settings.workspace);
           checkoutCommands = bobber.getCheckoutCommands(runsDir + '/' + internals.Run.settings.job.workspace , job.scm);
       }
       else {
           // ignore
       }
    }
    Hoek.merge(commands, checkoutCommands);
    Hoek.merge(commands, job.body);
    Hoek.merge(commands, job.tail);
    var createConfig = bait.createRun(commands);
    //console.log('running id: ' + createConfig.id);
    console.log('runId: ' + createConfig.id + ' jobId: ' + jobId);
    var runId = bait.startRun(createConfig.id);
    var updateJob = job;
    //updateJob.runs.push(runId);
    var updateConfig = jobPail.updatePail(updateJob);
    return { id: runId };
};

/*
exports.getConsole = function (jobId, runId) {

    var response = {
        jobId: jobId,
        runId: runId
        //console: file
    }
    return response;
};

*/
exports.getRun = function (jobId, runId) {

    var runsDir = internals.Run.settings.job.dirPath + '/' + jobId + '/runs';
    var bait = new Bait({ dirPath: runsDir });
    var run = bait.getRun(runId);
    run.elapsedTime = run.finishTime - run.startTime;
    return run;
};

exports.cancelRun = function (jobId, runId) {

    var runsDir = internals.Run.settings.job.dirPath + '/' + jobId + '/runs';
    var bait = new Bait({ dirPath: runsDir });
    var config = bait.cancelRun(runId);
    return null;
};

exports.getRunPids = function (jobId, runId) {

    var runsDir = internals.Run.settings.job.dirPath + '/' + jobId + '/runs';
    var bait = new Bait({ dirPath: runsDir });
    var pids = bait.getRunPids(runId);
    return pids;
};

exports.getRuns = function (jobId) {

    var runsDir = internals.Run.settings.job.dirPath + '/' + jobId + '/runs';
    var bait = new Bait({ dirPath: runsDir });
    var runs = bait.getRuns();
    var fullRuns = [];
    for (var i = 0; i < runs.length; i++) {
        var run = internals.Run.getRun(jobId, runs[i]);
        fullRuns.push(run);
    }
    // sort by createTime
    fullRuns.sort(function(a, b){

       return b.createTime-a.createTime;
    });
    return fullRuns;
};

exports.deleteRun = function (jobId, runId) {

    var jobPail = new Pail(internals.Run.settings.job);
    var job = jobPail.getPail(jobId);
    var runs = job.runs;
    var runsDir = internals.Run.settings.job.dirPath + '/' + jobId + '/runs';
    var bait = new Bait({ dirPath: runsDir });
    bait.deleteRun(runId);
    var updatePail = jobPail.updatePail(job);
    return null;
};

exports.getRunByLink = function (jobId, link) {

    var runsDir = internals.Run.settings.job.dirPath + '/' + jobId + '/runs';
    var bait = new Bait({ dirPath: runsDir });
    var run = bait.getRunByLink(link);
    return run;
};
