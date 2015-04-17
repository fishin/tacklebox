var Bait = require('bait');
var Brag = require('brag');
var FishHook = require('fishhook');
var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');

var Api = require('./api');
var Utils = require('./utils');

var internals = {
    defaults: {
        apiPath: '/api',
        job: {
            dirPath: '/tmp/tacklebox/job'
        },
        reel: {
            dirPath: '/tmp/tacklebox/reel'
        },
        user: {
            dirPath: '/tmp/tacklebox/user'
        },
        notify: {
            plugins: {
                email: {
                    plugin: require('brag'),
                    options: {
                        transporter: {
                            service: 'gmail',
                            auth: {
                                user: 'lloyd.benson@gmail.com',
                                pass: 'password'
                            }
                        },
                        from: 'donotreply@ficion.net',
                        subjectHeader: '[ficion]'
                    }
                }
            }
        }
    }
};

exports.register = function (server, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);
    settings.plugins = server.plugins;
    var api = new Api(settings);
    var utils = new Utils(settings);

    var bait = new Bait(settings.job);
    var fishhook = new FishHook({ startJob: bait.startJob });
    fishhook.startScheduler(bait.getJobs());


    //settings
    server.expose('settings', settings);
    // job
    server.expose('createJob', utils.Job.createJob);
    server.expose('updateJob', utils.Job.updateJob);
    server.expose('deleteJob', utils.Job.deleteJob);
    server.expose('getJob', utils.Job.getJob);
    server.expose('getJobByName', utils.Job.getJobByName);
    server.expose('getJobs', utils.Job.getJobs);
    server.expose('deleteWorkspace', utils.Job.deleteWorkspace);
    server.expose('getWorkspaceArtifact', utils.Job.getWorkspaceArtifact);
    server.expose('getAllCommits', utils.Job.getAllCommits);
    server.expose('getCompareCommits', utils.Job.getCompareCommits);
    server.expose('getPullRequests', utils.Job.getPullRequests);
    server.expose('getPullRequest', utils.Job.getPullRequest);
    server.expose('mergePullRequest', utils.Job.mergePullRequest);
    server.expose('deletePullRequest', utils.Job.deletePullRequest);
    server.expose('startJob', utils.Job.startJob);
    // run
    server.expose('cancelRun', utils.Job.cancelRun);
    server.expose('getRunPids', utils.Job.getRunPids);
    server.expose('deleteRun', utils.Job.deleteRun);
    server.expose('getRun', utils.Job.getRun);
    server.expose('getRunByName', utils.Job.getRunByName);
    server.expose('getRuns', utils.Job.getRuns);
    server.expose('getArchiveArtifact', utils.Job.getArchiveArtifact);
    server.expose('getArchiveArtifacts', utils.Job.getArchiveArtifacts);
    server.expose('getTestResult', utils.Job.getTestResult);
    // reel
    server.expose('createReel', utils.Reel.createReel);
    server.expose('deleteReel', utils.Reel.deleteReel);
    server.expose('getReel', utils.Reel.getReel);
    server.expose('getReels', utils.Reel.getReels);
    server.expose('updateReel', utils.Reel.updateReel);
    // user
    server.expose('createUser', utils.User.createUser);
    server.expose('deleteUser', utils.User.deleteUser);
    server.expose('getUser', utils.User.getUser);
    server.expose('getUserByName', utils.User.getUserByName);
    server.expose('getUsers', utils.User.getUsers);
    server.expose('updateUser', utils.User.updateUser);
    server.expose('validatePassword', utils.User.validatePassword);
    server.expose('createPasswordHash', utils.User.createPasswordHash);
    server.expose('generatePassword', utils.User.generatePassword);
    // notify
    server.expose('notify', utils.Notify.notify);
    // scheduler
    //server.expose('stopScheduler', utils.Scheduler.stopScheduler);
    //server.expose('startScheduler', utils.Scheduler.startScheduler);
    //server.expose('stopSchedule', utils.Scheduler.stopSchedule);
    //server.expose('startSchedule', utils.Scheduler.startSchedule);
    //server.expose('getSchedule', utils.Scheduler.getSchedule);
    //server.expose('getSchedules', utils.Scheduler.getSchedules);

    server.route([
        {
            method: 'POST',
            path: settings.apiPath + '/job',
            config: {
                handler: api.Job.createJob,
                description: 'create job',
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        description: Joi.string().allow('').optional(),
                        head: Joi.array().includes(
                            Joi.string()
                        ),
                        scm: Joi.object(),
                        archive: Joi.object(),
                        schedule: Joi.object(),
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
        {
            method: 'GET',
            path: settings.apiPath + '/jobs',
            config: {
                handler: api.Job.getJobs,
                description: 'get jobs'
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/start',
            config: {
                handler: api.Job.startJob,
                description: 'start job'
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}',
            config: {
                handler: api.Job.getJob,
                description: 'get job',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/prs',
            config: {
                handler: api.Job.getPullRequests,
                description: 'get pull requests',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/byname/{name}',
            config: {
                handler: api.Job.getJobByName,
                description: 'get job by name',
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/job/{jobId}',
            config: {
                handler: api.Job.updateJob,
                description: 'update job',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    },
                    payload: {
                        name: Joi.string(),
                        description: Joi.string().allow('').optional(),
                        head: Joi.array().includes(
                            Joi.string()
                        ),
                        scm: Joi.object(),
                        archive: Joi.object(),
                        schedule: Joi.object().optional(),
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
        {
            method: 'DELETE',
            path: settings.apiPath + '/job/{jobId}',
            config: {
                handler: api.Job.deleteJob,
                description: 'delete job',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath + '/job/{jobId}/workspace',
            config: {
                handler: api.Job.deleteWorkspace,
                description: 'delete workspace',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/commits',
            config: {
                handler: api.Job.getAllCommits,
                description: 'get commits',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}',
            config: {
                handler: api.Run.getRun,
                description: 'get run',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/archive/{artifact}',
            config: {
                handler: api.Run.getArchiveArtifact,
                description: 'get archive artifact',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required(),
                        artifact: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/archive',
            config: {
                handler: api.Run.getArchiveArtifacts,
                description: 'get archive artifacts',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/test/{artifact}',
            config: {
                handler: api.Run.getTestResult,
                description: 'get test result',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required(),
                        artifact: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/byname/{name}',
            config: {
                handler: api.Run.getRunByName,
                description: 'get run by name',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        name: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/cancel',
            config: {
                handler: api.Run.cancelRun,
                description: 'cancel run',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/pids',
            config: {
                handler: api.Run.getRunPids,
                description: 'get run pids',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/runs',
            config: {
                handler: api.Run.getRuns,
                description: 'get runs',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath + '/job/{jobId}/run/{runId}',
            config: {
                handler: api.Run.deleteRun,
                description: 'delete run',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/reel',
            config: {
                handler: api.Reel.createReel,
                description: 'create reel',
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        description: Joi.string().allow('').optional(),
                        directory: Joi.string().allow('').optional(),
                        host: Joi.string().hostname().required(),
                        port: Joi.number().required(),
                        size: Joi.number().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/reel/{reelId}',
            config: {
                handler: api.Reel.getReel,
                description: 'get reel',
                validate: {
                    params: {
                        reelId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/reel/byname/{name}',
            config: {
                handler: api.Reel.getReelByName,
                description: 'get reel by name',
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath + '/reel/{reelId}',
            config: {
                handler: api.Reel.deleteReel,
                description: 'delete reel',
                validate: {
                    params: {
                        reelId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/reel/{reelId}',
            config: {
                handler: api.Reel.updateReel,
                description: 'update reel',
                validate: {
                    params: {
                        reelId: Joi.string().guid().required()
                    },
                    payload: {
                        name: Joi.string().optional(),
                        description: Joi.string().allow('').optional(),
                        directory: Joi.string().allow('').optional(),
                        host: Joi.string().hostname().optional(),
                        port: Joi.number().optional(),
                        size: Joi.number().optional()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/reels',
            config: {
                handler: api.Reel.getReels,
                description: 'get reels'
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/user',
            config: {
                handler: api.User.createUser,
                description: 'create user',
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        type: Joi.string().required(),
                        displayName: Joi.string().when('type', { is: 'local', then: Joi.required(), otherwise: Joi.allow('').optional() }),
                        email: Joi.string().email().when('type', { is: 'local', then: Joi.required(), otherwise: Joi.allow('').optional() }),
                        password: Joi.string().when('type', { is: 'local', then: Joi.required(), otherwise: Joi.allow('').optional() })
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/user/{userId}',
            config: {
                handler: api.User.getUser,
                description: 'get user',
                validate: {
                    params: {
                        userId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath + '/user/{userId}',
            config: {
                handler: api.User.deleteUser,
                description: 'delete user',
                validate: {
                    params: {
                        userId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/user/{userId}',
            config: {
                handler: api.User.updateUser,
                description: 'update user',
                validate: {
                    params: {
                        userId: Joi.string().guid().required()
                    },
                    payload: {
                        name: Joi.string().optional(),
                        type: Joi.string().optional(),
                        displayName: Joi.string().when('type', { is: 'local', then: Joi.string().optional(), otherwise: Joi.string().allow('').optional() }),
                        email: Joi.string().email().when('type', { is: 'local', then: Joi.string().optional(), otherwise: Joi.string().allow('').optional() }),
                        password: Joi.string().when('type', { is: 'local', then: Joi.string().optional(), otherwise: Joi.string().allow('').optional() })
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/user/byname/{name}',
            config: {
                handler: api.User.getUserByName,
                description: 'get user by name',
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/users',
            config: {
                handler: api.User.getUsers,
                description: 'get users'
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/password',
            config: {
                handler: api.User.createPasswordHash,
                description: 'create password hash',
                validate: {
                    payload: {
                        password: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/user/{userId}/validate',
            config: {
                handler: api.User.validatePassword,
                description: 'validate password',
                validate: {
                    params: {
                        userId: Joi.string().guid().required()
                    },
                    payload: {
                        password: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/password/{length}',
            config: {
                handler: api.User.generatePassword,
                description: 'generate password',
                validate: {
                    params: {
                        length: Joi.number().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/notify',
            config: {
                handler: api.Notify.notify,
                description: 'notify',
                validate: {
                    payload: {
                        type: Joi.string().allow(''),
                        to: Joi.string().email(),
                        subject: Joi.string(),
                        message: Joi.string()
                    }
                }
            }
        }
        /*
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/console',
            config: {
                handler: api.Run.getConsole,
                description: 'get console',
                validate: {
                    params: {
                        jobId: Joi.string().guid().required(),
                        runId: Joi.string().guid().required()
                    }
                }
            }
        }
        */
    ]);

    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};
