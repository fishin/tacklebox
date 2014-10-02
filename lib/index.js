var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');
var Api = require('./api');
var Utils = require('./utils');

var internals = {
    defaults: {
        apiPath: '/api',
        job: {
            dirpath: '/tmp/tacklebox/job',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        run: {
//            dirpath: '/tmp/tacklebox/run',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        reel: {
            dirpath: '/tmp/tacklebox/reel',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        user: {
            dirpath: '/tmp/tacklebox/user',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};

exports.register = function (plugin, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);
    var reelOptions = {
        apiPath: settings.apiPath,
        reel: settings.run
    };

    plugin.register({

        plugin:require('reel'),
        options: reelOptions
    },  function (err) {
//        if (err) {
//            console.error('Failed to load plugin:', err);
//        }
    });
    settings.plugins = plugin.plugins;
    var api = new Api(settings);
    //console.log(api);
    //console.log(settings);

    var utils = new Utils(settings);
    //console.log(utils);

    plugin.expose('settings', settings);
    plugin.expose('createJob', utils.Job.createJob);
    plugin.expose('updateJob', utils.Job.updateJob);
    plugin.expose('deleteJob', utils.Job.deleteJob);
    plugin.expose('getJob', utils.Job.getJob);
    plugin.expose('getJobs', utils.Job.getJobs);
    plugin.expose('startRun', utils.Run.startRun);
    plugin.expose('cancelRun', utils.Run.cancelRun);
    plugin.expose('getRunPid', utils.Run.getRunPid);
    plugin.expose('deleteRun', utils.Run.deleteRun);
    plugin.expose('getRun', utils.Run.getRun);
    plugin.expose('getRunByLink', utils.Run.getRunByLink);
    plugin.expose('getRuns', utils.Run.getRuns);
    plugin.expose('createReel', utils.Reel.createReel);
    plugin.expose('deleteReel', utils.Reel.deleteReel);
    plugin.expose('getReel', utils.Reel.getReel);
    plugin.expose('getReels', utils.Reel.getReels);
    plugin.expose('updateReel', utils.Reel.updateReel);
    plugin.expose('createUser', utils.User.createUser);
    plugin.expose('deleteUser', utils.User.deleteUser);
    plugin.expose('getUser', utils.Reel.getUser);
    plugin.expose('getUsers', utils.Reel.getUsers);
    plugin.expose('updateUser', utils.Reel.updateUser);

    plugin.route([
        { method: 'GET', path: settings.apiPath+'/jobs', config: { handler: api.Job.getJobs, description: "get jobs" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/start', config: { handler: api.Run.startRun, description: "start run" } },
        { method: 'POST', path: settings.apiPath+'/job', config: { handler: api.Job.createJob, description: "create job" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}', config: { handler: api.Job.getJob, description: "get job" } },
        { method: 'GET', path: settings.apiPath+'/job/bylink/{link}', config: { handler: api.Job.getJobByLink, description: "get job by link" } },
        { method: 'PUT', path: settings.apiPath+'/job/{job_id}', config: { handler: api.Job.updateJob, description: "update job" } },
        { method: 'DELETE', path: settings.apiPath+'/job/{job_id}', config: { handler: api.Job.deleteJob, description: "delete job" } },
        //{ method: 'GET', path: settings.apiPath+'/job/{job_id}/run/{run_id}/console', config: { handler: api.Run.getConsole, description: "get console" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/run/{run_id}', config: { handler: api.Run.getRun, description: "get run" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/run/bylink/{link}', config: { handler: api.Run.getRunByLink, description: "get run by link" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/run/{run_id}/cancel', config: { handler: api.Run.cancelRun, description: "cancel run" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/run/{run_id}/pid', config: { handler: api.Run.getRunPid, description: "get run pid" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/runs', config: { handler: api.Run.getRuns, description: "get runs" } }, 
        { method: 'DELETE', path: settings.apiPath+'/job/{job_id}/run/{run_id}', config: { handler: api.Run.deleteRun, description: "delete run" } },
        { method: 'POST', path: settings.apiPath+'/reel', config: { handler: api.Reel.createReel, description: "create reel" } },
        { method: 'GET', path: settings.apiPath+'/reel/{reel_id}', config: { handler: api.Reel.getReel, description: "get reel" } },
        { method: 'GET', path: settings.apiPath+'/reel/bylink/{link}', config: { handler: api.Reel.getReelByLink, description: "get reel by link" } },
        { method: 'DELETE', path: settings.apiPath+'/reel/{reel_id}', config: { handler: api.Reel.deleteReel, description: "delete reel" } },
        { method: 'POST', path: settings.apiPath+'/reel/{reel_id}', config: { handler: api.Reel.updateReel, description: "update reel" } },
        { method: 'GET', path: settings.apiPath+'/reels', config: { handler: api.Reel.getReels, description: "get reels" } },
        { method: 'POST', path: settings.apiPath+'/user', config: { handler: api.User.createUser, description: "create user" } },
        { method: 'GET', path: settings.apiPath+'/user/{user_id}', config: { handler: api.User.getUser, description: "get user" } },
        { method: 'DELETE', path: settings.apiPath+'/user/{user_id}', config: { handler: api.User.deleteUser, description: "delete user" } },
        { method: 'POST', path: settings.apiPath+'/user/{user_id}', config: { handler: api.User.updateUser, description: "update user" } },
        { method: 'GET', path: settings.apiPath+'/users', config: { handler: api.User.getUsers, description: "get users" } }
    ]);

    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};
