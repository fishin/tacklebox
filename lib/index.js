var Brag = require('brag');
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
    var reelOptions = {
        apiPath: settings.apiPath,
        dirPath: settings.reel.dirPath
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
    var utils = new Utils(settings);

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
    server.expose('getCommits', utils.Job.getCommits);
    server.expose('startJob', utils.Job.startJob);
    // run
    server.expose('cancelRun', utils.Run.cancelRun);
    server.expose('getRunPids', utils.Run.getRunPids);
    server.expose('deleteRun', utils.Run.deleteRun);
    server.expose('getRun', utils.Run.getRun);
    server.expose('getRunByName', utils.Run.getRunByName);
    server.expose('getRuns', utils.Run.getRuns);
    server.expose('getArchiveArtifact', utils.Run.getArchiveArtifact);
    server.expose('getArchiveArtifacts', utils.Run.getArchiveArtifacts);
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
    server.expose('getUsers', utils.User.getUsers);
    server.expose('updateUser', utils.User.updateUser);
    // notify
    server.expose('notify', utils.Notify.notify);

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
                        archive: Joi.object(),
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
            path: settings.apiPath+'/jobs',
            config: {
                handler: api.Job.getJobs,
                description: "get jobs"
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/job/{jobId}/start',
            config: {
                handler: api.Job.startJob,
                description: "start job"
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/job/{jobId}',
            config: {
                handler: api.Job.getJob,
                description: "get job",
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/job/byname/{name}',
            config: {
                handler: api.Job.getJobByName,
                description: "get job by name",
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'PUT',
            path: settings.apiPath+'/job/{jobId}',
            config: {
                handler: api.Job.updateJob,
                description: "update job",
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    },
                    payload: {
                        name: Joi.string(),
                        head: Joi.array().includes(
                            Joi.string()
                        ),
                        scm: Joi.object(),
                        archive: Joi.object(),
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
            path: settings.apiPath+'/job/{jobId}',
            config: {
                handler: api.Job.deleteJob,
                description: "delete job",
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath+'/job/{jobId}/workspace',
            config: {
                handler: api.Job.deleteWorkspace,
                description: "delete workspace",
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/job/{jobId}/commits',
            config: {
                handler: api.Job.getCommits,
                description: "get commits",
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/job/{jobId}/run/{runId}',
            config: {
                handler: api.Run.getRun,
                description: "get run",
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
            path: settings.apiPath+'/job/{jobId}/run/{runId}/archive/{artifact}',
            config: {
                handler: api.Run.getArchiveArtifact,
                description: "get archive artifact",
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
            path: settings.apiPath+'/job/{jobId}/run/{runId}/archive',
            config: {
                handler: api.Run.getArchiveArtifacts,
                description: "get archive artifacts",
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
            path: settings.apiPath+'/job/{jobId}/run/byname/{name}',
            config: {
                handler: api.Run.getRunByName,
                description: "get run by name",
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
            path: settings.apiPath+'/job/{jobId}/run/{runId}/cancel',
            config: {
                handler: api.Run.cancelRun,
                description: "cancel run",
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
            path: settings.apiPath+'/job/{jobId}/run/{runId}/pids',
            config: {
                handler: api.Run.getRunPids,
                description: "get run pids",
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
            path: settings.apiPath+'/job/{jobId}/runs',
            config: {
                handler: api.Run.getRuns,
                description: "get runs",
                validate: {
                    params: {
                        jobId: Joi.string().guid().required()
                    }
                }
            }
        }, 
        {
            method: 'DELETE',
            path: settings.apiPath+'/job/{jobId}/run/{runId}',
            config: {
                handler: api.Run.deleteRun,
                description: "delete run",
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
            path: settings.apiPath+'/reel',
            config: {
                handler: api.Reel.createReel,
                description: "create reel",
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        host: Joi.string().hostname().required(),
                        size: Joi.number().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/reel/{reelId}',
            config: {
                handler: api.Reel.getReel,
                description: "get reel",
                validate: {
                    params: {
                        reelId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/reel/byname/{name}',
            config: {
                handler: api.Reel.getReelByName,
                description: "get reel by name",
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath+'/reel/{reelId}',
            config: {
                handler: api.Reel.deleteReel,
                description: "delete reel",
                validate: {
                    params: {
                        reelId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath+'/reel/{reelId}',
            config: {
                handler: api.Reel.updateReel,
                description: "update reel",
                validate: {
                    params: {
                        reelId: Joi.string().guid().required()
                    },
                    payload: {
                        name: Joi.string(),
                        host: Joi.string().hostname(),
                        size: Joi.number()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/reels',
            config: {
                handler: api.Reel.getReels,
                description: "get reels"
            }
        },
        {
            method: 'POST',
            path: settings.apiPath+'/user',
            config: {
                handler: api.User.createUser,
                description: "create user",
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        name: Joi.string(),
                        email: Joi.string().email()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/user/{userId}',
            config: {
                handler: api.User.getUser,
                description: "get user",
                validate: {
                    params: {
                        userId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath+'/user/{userId}',
            config: {
                handler: api.User.deleteUser,
                description: "delete user",
                validate: {
                    params: {
                        userId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath+'/user/{userId}',
            config: {
                handler: api.User.updateUser,
                description: "update user",
                validate: {
                    params: {
                        userId: Joi.string().guid().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath+'/users',
            config: {
                handler: api.User.getUsers,
                description: "get users"
            }
        },
        {
            method: 'POST',
            path: settings.apiPath+'/notify',
            config: {
                handler: api.Notify.notify,
                description: "notify",
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
            path: settings.apiPath+'/job/{jobId}/run/{runId}/console',
            config: {
                handler: api.Run.getConsole,
                description: "get console",
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
