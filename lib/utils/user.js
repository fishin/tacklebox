var Angler = require('angler');

var internals = {};

module.exports = function (options) {

    var angler = new Angler(options.user);
    this.createUser = angler.createAngler;
    this.deleteUser = angler.deleteAngler;
    this.getUser = angler.getAngler;
    this.updateUser = angler.updateAngler;
    this.getUsers = angler.getAnglers;
};
