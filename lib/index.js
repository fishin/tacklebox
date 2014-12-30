var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');
var Api = require('./api');
var Utils = require('./utils');

var internals = {
    defaults: {
        apiPath: '/api',
        job: {
            dirpath: '/tmp/tacklebox/job'
        },
        reel: {
            dirpath: '/tmp/tacklebox/reel'
        },
        user: {
            dirpath: '/tmp/tacklebox/user'
        }
    }
};

exports.register = function (server, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);
    var reelOptions = {
        apiPath: settings.apiPath,
        reel: settings.run
    };

    server.register({

        register: require('reel'),
        options: reelOptions
    },  function (err) {
//        if (err) {
//            console.error('Failed to load plugin:', err);
//        }
    });
    settings.plugins = server.plugins;
    var api = new Api(settings);
    //console.log(api);
    //console.log(settings);

    var utils = new Utils(settings);
    //console.log(utils);

    server.expose('settings', settings);
    server.expose('createJob', utils.Job.createJob);
    server.expose('updateJob', utils.Job.updateJob);
    server.expose('deleteJob', utils.Job.deleteJob);
    server.expose('deleteWorkspace', utils.Job.deleteWorkspace);
    server.expose('getJob', utils.Job.getJob);
    server.expose('getJobs', utils.Job.getJobs);
    server.expose('startRun', utils.Run.startRun);
    server.expose('cancelRun', utils.Run.cancelRun);
    server.expose('getRunPids', utils.Run.getRunPids);
    server.expose('deleteRun', utils.Run.deleteRun);
    server.expose('getRun', utils.Run.getRun);
    server.expose('getRunByLink', utils.Run.getRunByLink);
    server.expose('getRuns', utils.Run.getRuns);
    server.expose('createReel', utils.Reel.createReel);
    server.expose('deleteReel', utils.Reel.deleteReel);
    server.expose('getReel', utils.Reel.getReel);
    server.expose('getReels', utils.Reel.getReels);
    server.expose('updateReel', utils.Reel.updateReel);
    server.expose('createUser', utils.User.createUser);
    server.expose('deleteUser', utils.User.deleteUser);
    server.expose('getUser', utils.User.getUser);
    server.expose('getUsers', utils.User.getUsers);
    server.expose('updateUser', utils.User.updateUser);

    server.route([
        {
            method: 'POST',
            path: settings.apiPath+'/job',
            config: {
                handler: api.Job.createJob,
                description: "create job",
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        head: Joi.array().includes(
                            Joi.string()
                        ),
                        scm: Joi.object(),
                        body: Joi.array().includes(
                            Joi.string()
                        ),
                        tail: Joi.array().includes(
                            Joi.string()
                        )
                    }
                }
            }
        },
        { method: 'GET', path: settings.apiPath+'/jobs', config: { handler: api.Job.getJobs, description: "get jobs" } },
        { method: 'GET', path: settings.apiPath+'/job/{jobId}/start', config: { handler: api.Run.startRun, description: "start run" } },
        { method: 'GET', path: settings.apiPath+'/job/{jobId}', config: { handler: api.Job.getJob, description: "get job" } },
        { method: 'GET', path: settings.apiPath+'/job/bylink/{link}', config: { handler: api.Job.getJobByLink, description: "get job by link" } },
        { method: 'PUT', path: settings.apiPath+'/job/{jobId}', config: { handler: api.Job.updateJob, description: "update job" } },
        { method: 'DELETE', path: settings.apiPath+'/job/{jobId}', config: { handler: api.Job.deleteJob, description: "delete job" } },
        { method: 'DELETE', path: settings.apiPath+'/job/{jobId}/workspace', config: { handler: api.Job.deleteWorkspace, description: "delete workspace" } },
        //{ method: 'GET', path: settings.apiPath+'/job/{jobId}/run/{runId}/console', config: { handler: api.Run.getConsole, description: "get console" } },
        { method: 'GET', path: settings.apiPath+'/job/{jobId}/run/{runId}', config: { handler: api.Run.getRun, description: "get run" } },
        { method: 'GET', path: settings.apiPath+'/job/{jobId}/run/bylink/{link}', config: { handler: api.Run.getRunByLink, description: "get run by link" } },
        { method: 'GET', path: settings.apiPath+'/job/{jobId}/run/{runId}/cancel', config: { handler: api.Run.cancelRun, description: "cancel run" } },
        { method: 'GET', path: settings.apiPath+'/job/{jobId}/run/{runId}/pids', config: { handler: api.Run.getRunPids, description: "get run pids" } },
        { method: 'GET', path: settings.apiPath+'/job/{jobId}/runs', config: { handler: api.Run.getRuns, description: "get runs" } }, 
        { method: 'DELETE', path: settings.apiPath+'/job/{jobId}/run/{runId}', config: { handler: api.Run.deleteRun, description: "delete run" } },
        { method: 'POST', path: settings.apiPath+'/reel', config: { handler: api.Reel.createReel, description: "create reel" } },
        { method: 'GET', path: settings.apiPath+'/reel/{reelId}', config: { handler: api.Reel.getReel, description: "get reel" } },
        { method: 'GET', path: settings.apiPath+'/reel/bylink/{link}', config: { handler: api.Reel.getReelByLink, description: "get reel by link" } },
        { method: 'DELETE', path: settings.apiPath+'/reel/{reelId}', config: { handler: api.Reel.deleteReel, description: "delete reel" } },
        { method: 'POST', path: settings.apiPath+'/reel/{reelId}', config: { handler: api.Reel.updateReel, description: "update reel" } },
        { method: 'GET', path: settings.apiPath+'/reels', config: { handler: api.Reel.getReels, description: "get reels" } },
        { method: 'POST', path: settings.apiPath+'/user', config: { handler: api.User.createUser, description: "create user" } },
        { method: 'GET', path: settings.apiPath+'/user/{userId}', config: { handler: api.User.getUser, description: "get user" } },
        { method: 'DELETE', path: settings.apiPath+'/user/{userId}', config: { handler: api.User.deleteUser, description: "delete user" } },
        { method: 'POST', path: settings.apiPath+'/user/{userId}', config: { handler: api.User.updateUser, description: "update user" } },
        { method: 'GET', path: settings.apiPath+'/users', config: { handler: api.User.getUsers, description: "get users" } }
    ]);

    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};
