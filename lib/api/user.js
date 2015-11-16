'use strict';

const Utils = require('../utils');

const internals = {};

module.exports = internals.User = function (options) {

    this.settings = options;
    const utils = new Utils(options);
    internals.User.settings = options;
    internals.User.createUser = utils.User.createUser;
    internals.User.deleteUser = utils.User.deleteUser;
    internals.User.getUser = utils.User.getUser;
    internals.User.getUserByName = utils.User.getUserByName;
    internals.User.updateUser = utils.User.updateUser;
    internals.User.getUsers = utils.User.getUsers;
    internals.User.createPasswordHash = utils.User.createPasswordHash;
    internals.User.generatePassword = utils.User.generatePassword;
    internals.User.validatePassword = utils.User.validatePassword;
    this.createUser = exports.createUser;
    this.deleteUser = exports.deleteUser;
    this.getUser = exports.getUser;
    this.getUserByName = exports.getUserByName;
    this.updateUser = exports.updateUser;
    this.getUsers = exports.getUsers;
    this.createPasswordHash = exports.createPasswordHash;
    this.generatePassword = exports.generatePassword;
    this.validatePassword = exports.validatePassword;
};

exports.createUser = function (request, reply) {

    const user = internals.User.createUser(request.payload);
    return reply(user);
};

exports.updateUser = function (request, reply) {

    const user = internals.User.updateUser(request.params.userId, request.payload);
    return reply(user);
};

exports.getUser = function (request, reply) {

    const user = internals.User.getUser(request.params.userId);
    return reply(user);
};

exports.getUserByName = function (request, reply) {

    const user = internals.User.getUserByName(request.params.name);
    return reply(user);
};

exports.getUsers = function (request, reply) {

    const users = internals.User.getUsers();
    return reply(users);
};

exports.deleteUser = function (request, reply) {

    internals.User.deleteUser(request.params.userId);
    return reply('');
};

exports.createPasswordHash = function (request, reply) {

    const hash = internals.User.createPasswordHash(request.payload.password);
    return reply(hash);
};

exports.generatePassword = function (request, reply) {

    const password = internals.User.generatePassword(request.params.length);
    return reply(password);
};

exports.validatePassword = function (request, reply) {

    const user = internals.User.getUser(request.params.userId);
    return reply(internals.User.validatePassword(request.payload.password, user.password));
};
