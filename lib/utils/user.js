var Angler = require('angler');
var Pail = require('pail');
var Hoek = require('hoek');

var internals = {};

module.exports = internals.User = function (options) {

    this.settings = options;
    internals.User.settings = options;
    var angler = new Angler(options.user);
    internals.User.getUser = angler.getAngler;
    this.createUser = angler.createAngler;
    this.deleteUser = angler.deleteAngler;
    this.getUser = angler.getAngler;
    this.updateUser = angler.updateAngler;
    this.getUsers = angler.getAnglers;
};
