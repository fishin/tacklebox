var Bait = require('bait');
var FishHook = require('fishhook');
var Hapi = require('hapi');
var Hoek = require('hoek');

var Api = require('./api');
var Schema = require('./schema');
var Utils = require('./utils');

var internals = {
    defaults: {
        apiPath: '/api',
        job: {
            dirPath: '/tmp/tacklebox/job',
            queue: {
                size: 1
            },
            notify: {
                plugins: {
                    email: {
                        options: {
                            transporter: {
                                service: 'gmail',
                                auth: {
                                    user: 'lloyd.benson@gmail.com',
                                    pass: 'password'
                                }
                            },
                            from: 'donotreply@ficion.net',
                            subjectTag: 'ficion'
                        }
                    }
                }
            }
        },
        reel: {
            dirPath: '/tmp/tacklebox/reel'
        },
        user: {
            dirPath: '/tmp/tacklebox/user'
        },
        github: {
            token: null
        }
    }
};

exports.register = function (server, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);
    settings.server = server;
    var api = new Api(settings);
    var utils = new Utils(settings);
    var bait = new Bait(settings.job);
    var fishhook = new FishHook({
        getPullRequests: bait.getPullRequests,
        getRuns: bait.getRuns,
        startJob: bait.addJob,
        token: settings.github.token
    });
    fishhook.startScheduler(bait.getJobs());
    bait.startQueue();

    server.route([
        {
            method: 'POST',
            path: settings.apiPath + '/job',
            config: {
                handler: api.Job.createJob,
                description: 'create job',
                validate: {
                    payload: Schema.createJobSchema
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
            path: settings.apiPath + '/jobs/active',
            config: {
                handler: api.Job.getActiveJobs,
                description: 'get active jobs'
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/prs/active',
            config: {
                handler: api.Job.getActivePullRequests,
                description: 'get active pull requests'
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/start',
            config: {
                handler: api.Job.startJob,
                description: 'start job',
                validate: {
                    params: Schema.requiredJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}',
            config: {
                handler: api.Job.getJob,
                description: 'get job',
                validate: {
                    params: Schema.requiredJobSchema
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
                    params: Schema.requiredJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}',
            config: {
                handler: api.Job.getPullRequest,
                description: 'get pull request',
                validate: {
                    params: Schema.requiredPRJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}/merge',
            config: {
                handler: api.Job.mergePullRequest,
                description: 'merge pull request',
                validate: {
                    params: Schema.requiredPRJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}/run/{runId}/cancel',
            config: {
                handler: api.Run.cancelPullRequest,
                description: 'cancel pull request',
                validate: {
                    params: Schema.requiredPRRunSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}/runs',
            config: {
                handler: api.Run.getPullRequestRuns,
                description: 'get pull request runs',
                validate: {
                    params: Schema.requiredPRJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}/run/{runId}',
            config: {
                handler: api.Run.getPullRequestRun,
                description: 'get pull request run',
                validate: {
                    params: Schema.requiredPRRunSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}/run/{runId}/previous',
            config: {
                handler: api.Run.getPullRequestPreviousRun,
                description: 'get pull request previous run',
                validate: {
                    params: Schema.requiredPRRunSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}/start',
            config: {
                handler: api.Job.startPullRequest,
                description: 'start pull request',
                validate: {
                    params: Schema.requiredPRJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/pr/{number}/run/{runId}/pids',
            config: {
                handler: api.Run.getPullRequestRunPids,
                description: 'get pull request run pids',
                validate: {
                    params: Schema.requiredPRRunSchema
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath + '/job/{jobId}/pr/{number}',
            config: {
                handler: api.Job.deletePullRequest,
                description: 'delete pull request',
                validate: {
                    params: Schema.requiredPRJobSchema
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
                    params: Schema.requiredNameSchema
                }
            }
        },
        {
            method: 'PUT',
            path: settings.apiPath + '/job/{jobId}',
            config: {
                handler: api.Job.updateJob,
                description: 'update job',
                validate: {
                    params: Schema.requiredJobSchema,
                    payload: Schema.updateJobSchema
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
                    params: Schema.requiredJobSchema
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
                    params: Schema.requiredJobSchema
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
                    params: Schema.requiredJobSchema
                }
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/job/{jobId}/commits/compare',
            config: {
                handler: api.Job.getCompareCommits,
                description: 'get compare commits',
                validate: {
                    params: Schema.requiredJobSchema,
                    payload: Schema.compareCommitsSchema
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
                    params: Schema.requiredRunSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/stats',
            config: {
                handler: api.Run.getRunStats,
                description: 'get run statistics',
                validate: {
                    params: Schema.requiredRunSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/run/{runId}/previous',
            config: {
                handler: api.Run.getPreviousRun,
                description: 'get previous run',
                validate: {
                    params: Schema.requiredRunSchema
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
                    params: Schema.artifactSchema
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
                    params: Schema.requiredRunSchema
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
                    params: Schema.artifactSchema
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
                    params: Schema.requiredJobNameSchema
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
                    params: Schema.requiredRunSchema
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
                    params: Schema.requiredRunSchema
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
                    params: Schema.requiredJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/runs/stats',
            config: {
                handler: api.Run.getRunsStats,
                description: 'get runs statistics',
                validate: {
                    params: Schema.requiredJobSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/job/{jobId}/runs/stats/limit/{limit}',
            config: {
                handler: api.Run.getRunsStatsLimit,
                description: 'get runs statistics with limit',
                validate: {
                    params: Schema.runsLimitSchema
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
                    params: Schema.requiredRunSchema
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
                    payload: Schema.createReelSchema
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
                    params: Schema.requiredReelSchema
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
                    params: Schema.requiredNameSchema
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
                    params: Schema.requiredReelSchema
                }
            }
        },
        {
            method: 'PUT',
            path: settings.apiPath + '/reel/{reelId}',
            config: {
                handler: api.Reel.updateReel,
                description: 'update reel',
                validate: {
                    params: Schema.requiredReelSchema,
                    payload: Schema.updateReelSchema
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
                    payload: Schema.createUserSchema
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
                    params: Schema.requiredUserSchema
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
                    params: Schema.requiredUserSchema
                }
            }
        },
        {
            method: 'PUT',
            path: settings.apiPath + '/user/{userId}',
            config: {
                handler: api.User.updateUser,
                description: 'update user',
                validate: {
                    params: Schema.requiredUserSchema,
                    payload: Schema.updateUserSchema
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
                    params: Schema.requiredNameSchema
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
                    payload: Schema.requiredPasswordSchema
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
                    params: Schema.requiredUserSchema,
                    payload: Schema.requiredPasswordSchema
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
                    params: Schema.requiredLengthSchema
                }
            }
        },
        {
            method: 'GET',
            path: settings.apiPath + '/queue',
            config: {
                handler: api.Job.getQueue,
                description: 'get queue'
            }
        },
        {
            method: 'POST',
            path: settings.apiPath + '/queue',
            config: {
                handler: api.Job.addJob,
                description: 'add job to queue',
                validate: {
                    payload: Schema.requiredJobSchema
                }
            }
        },
        {
            method: 'DELETE',
            path: settings.apiPath + '/queue/{jobId}',
            config: {
                handler: api.Job.removeJob,
                description: 'remove job from queue',
                validate: {
                    params: Schema.requiredJobSchema
                }
            }
        }
    ]);
    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};
