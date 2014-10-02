var Pail = require('pail');
var Hoek = require('hoek');

var internals = {};

module.exports = internals.User = function (options) {

    this.settings = options;
    internals.User.settings = options;
    internals.User.getUser = exports.getUser;
    this.createUser = exports.createUser;
    this.deleteUser = exports.deleteUser;
    this.getUser = exports.getUser;
    this.updateUser = exports.updateUser;
    this.getUsers = exports.getUsers;
};

exports.createUser = function (payload) {

    var pail = new Pail(internals.User.settings.user);
    var updatePail = pail.createPail(payload);
    return updatePail;
};

exports.updateUser = function (user_id, payload) {

    var pail = new Pail(internals.User.settings.user);
    var getPail = pail.getPail(user_id);
    var config = Hoek.applyToDefaults(getPail, payload);
    config.updateTime = new Date().getTime();
    var updatedPail = pail.updatePail(config);
    return updatedPail;
};

exports.getUser = function (user_id) {

    var pail = new Pail(internals.User.settings.user);
    var config = pail.getPail(user_id);
    return config;
};

exports.deleteUser = function (user_id) {

    var pail = new Pail(internals.User.settings.user);
    pail.deletePail(user_id);
    return null;
};

exports.getUsers = function () {

    var pail = new Pail(internals.User.settings.user);
    var users = pail.getPails();
    var fullUsers = [];
    for (var i = 0; i < users.length; i++) {
        var user = internals.User.getUser(users[i]);
        fullUsers.push(user);
    }
    // sort by createTime
    fullUsers.sort(function(a, b){

       return a.createTime-b.createTime;
    });
    return fullUsers;
};
