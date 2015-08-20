var Joi = require('joi');

exports.createJobSchema = {
    name: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    targets: Joi.string().allow('').optional(),
    head: Joi.array().items(
        Joi.string()
    ),
    scm: Joi.object(),
    archive: Joi.object(),
    notify: Joi.object(),
    schedule: Joi.object(),
    body: Joi.array().items(
        Joi.string().allow('')
    ),
    tail: Joi.array().items(
        Joi.string()
    )
};

exports.requiredJobSchema = {
    jobId: Joi.string().guid().required()
};

exports.runsLimitSchema = {
    jobId: Joi.string().guid().required(),
    limit: Joi.number().required()
};
exports.requiredRunSchema = {
    jobId: Joi.string().guid().required(),
    runId: Joi.string().guid().required()
};

exports.requiredPRJobSchema = {
    jobId: Joi.string().guid().required(),
    number: Joi.number().required()
};
exports.requiredPRRunSchema = {
    jobId: Joi.string().guid().required(),
    runId: Joi.string().guid().required(),
    number: Joi.number().required()
};

exports.updateJobSchema = {
    name: Joi.string(),
    description: Joi.string().allow('').optional(),
    targets: Joi.string().allow('').optional(),
    head: Joi.array().items(
        Joi.string()
    ),
    scm: Joi.object(),
    archive: Joi.object(),
    notify: Joi.object().optional(),
    schedule: Joi.object().optional(),
    body: Joi.array().items(
        Joi.string().allow('')
    ),
    tail: Joi.array().items(
        Joi.string()
    )
};

exports.compareCommitsSchema = {
    commit1: Joi.string().length(40).required(),
    commit2: Joi.string().length(40).required()
};

exports.artifactSchema = {
    jobId: Joi.string().guid().required(),
    runId: Joi.string().guid().required(),
    artifact: Joi.string().required()
};

exports.requiredNameSchema = {
    name: Joi.string().required()
};

exports.requiredJobNameSchema = {
    jobId: Joi.string().guid().required(),
    name: Joi.string().required()
};

exports.createReelSchema = {
    name: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    directory: Joi.string().allow('').optional(),
    host: Joi.string().hostname().required(),
    port: Joi.number().required(),
    size: Joi.number().required()
};

exports.requiredReelSchema = {
    reelId: Joi.string().guid().required()
};

exports.updateReelSchema = {
    name: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
    directory: Joi.string().allow('').optional(),
    host: Joi.string().hostname().optional(),
    port: Joi.number().optional(),
    size: Joi.number().optional()
};

exports.createUserSchema = {
    name: Joi.string().required(),
    type: Joi.string().required(),
    displayName: Joi.string().when('type', { is: 'local', then: Joi.required(), otherwise: Joi.allow('').optional() }),
    email: Joi.string().email().when('type', { is: 'local', then: Joi.required(), otherwise: Joi.allow('').optional() }),
    password: Joi.string().when('type', { is: 'local', then: Joi.required(), otherwise: Joi.allow('').optional() })
};

exports.requiredUserSchema = {
    userId: Joi.string().guid().required()
};

exports.updateUserSchema = {
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    displayName: Joi.string().when('type', { is: 'local', then: Joi.string().optional(), otherwise: Joi.string().allow('').optional() }),
    email: Joi.string().email().when('type', { is: 'local', then: Joi.string().optional(), otherwise: Joi.string().allow('').optional() }),
    password: Joi.string().when('type', { is: 'local', then: Joi.string().optional(), otherwise: Joi.string().allow('').optional() })
};

exports.passwordSchema = {
    password: Joi.string().required()
};

exports.passwordLengthSchema = {
    length: Joi.number().required()
};
