var Angler = require('angler');

var internals = {};

module.exports = function (options) {

    var angler = new Angler(options.user);
    this.createUser = angler.createUser;
    this.deleteUser = angler.deleteUser;
    this.getUser = angler.getUser;
    this.updateUser = angler.updateUser;
    this.getUsers = angler.getUsers;
    this.getUserByName = angler.getUserByName;
    this.validatePassword = angler.validatePassword;
    this.createPasswordHash = angler.createPasswordHash;
};
