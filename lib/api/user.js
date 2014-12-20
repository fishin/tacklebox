var Utils = require('../utils');

var internals = {};

module.exports = internals.User = function (options) {

    this.settings = options;
    var utils = new Utils(options);
    internals.User.settings = options;
    internals.User.createUser = utils.User.createUser;
    internals.User.deleteUser = utils.User.deleteUser;
    internals.User.getUser = utils.User.getUser;
    internals.User.updateUser = utils.User.updateUser;
    internals.User.getUsers = utils.User.getUsers;
    this.createUser = exports.createUser;
    this.deleteUser = exports.deleteUser;
    this.getUser = exports.getUser;
    this.updateUser = exports.updateUser;
    this.getUsers = exports.getUsers;
};

exports.createUser = function (request,reply) {

    var user = internals.User.createUser(request.payload);
    reply(user);
};

exports.updateUser = function (request,reply) {

    var user = internals.User.updateUser(request.params.userId, request.payload);
    reply(user);
};

exports.getUser = function (request,reply) {

    var user = internals.User.getUser(request.params.userId);
    reply(user);
};

exports.getUsers = function (request,reply) {

    var users = internals.User.getUsers();
    reply(users);
};

exports.deleteUser = function (request,reply) {

    internals.User.deleteUser(request.params.userId);
    reply('');
};
