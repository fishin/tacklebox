var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');
var Api = require('./api');

var internals = {
    defaults: {
        apiPath: '/api',
        job: {
            pailPath: '/tmp/tacklebox/job',
            workspace: 'workspace',
            configFile: 'config.json'
        },
        run: {
            pailPath: '/tmp/tacklebox/run',
            workspace: 'workspace',
            configFile: 'config.json'
        }
    }
};

exports.register = function (plugin, options, next) {


    var settings = Hoek.applyToDefaults(internals.defaults, options);
    var api = new Api(settings);
    //console.log(api.Run);
    var reelOptions = {
        reel: internals.defaults.run
    };

    plugin.register({

        plugin:require('reel'),
        options: reelOptions
    },  function (err) {
//        if (err) {
//            console.error('Failed to load plugin:', err);
//        }
    });

    plugin.route([
        { method: 'GET', path: settings.apiPath+'/jobs', config: { handler: api.Job.getJobs, description: "get jobs" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/run', config: { handler: api.Run.startRun, description: "start run" } },
        { method: 'POST', path: settings.apiPath+'/job', config: { handler: api.Job.createJob, description: "create job" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}', config: { handler: api.Job.getJob, description: "get job" } },
        { method: 'PUT', path: settings.apiPath+'/job/{job_id}', config: { handler: api.Job.updateJob, description: "update job" } },
        { method: 'DELETE', path: settings.apiPath+'/job/{job_id}', config: { handler: api.Job.deleteJob, description: "delete job" } },
        //{ method: 'GET', path: settings.apiPath+'/job/{job_id}/run/{run_id}/console', config: { handler: api.Run.getConsole, description: "get console" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/run/{run_id}', config: { handler: api.Run.getRun, description: "get run" } },
        { method: 'GET', path: settings.apiPath+'/job/{job_id}/runs', config: { handler: api.Run.getRuns, description: "get runs" } }, 
        { method: 'DELETE', path: settings.apiPath+'/job/{job_id}/run/{run_id}', config: { handler: api.Run.deleteRun, description: "delete run" } }
        // { method: 'GET', path: settings.apiPath+'/job/{job_id}/run/{run_id}/cancel', config: { handler: api.Run.cancelRun, description: "cancel run" } },
    ]);

    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};
