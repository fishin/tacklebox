var Utils = require('../utils');

var internals = {};

module.exports = internals.Notify = function (options) {

    var utils = new Utils(options);
    internals.Notify.settings = options;
    internals.Notify.notify = utils.Notify.notify;
    this.notify = exports.notify;
};

exports.notify = function (request, reply) {

    internals.Notify.notify(request.payload, function(notify) {

        reply(notify);
    });
};
