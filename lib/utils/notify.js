var internals = {};

module.exports = internals.Notify = function (options) {

    internals.Notify.settings = options;
    internals.Notify.notify = exports.notify;
    this.notify = exports.notify;
};

exports.notify = function (notify, callback) {

    if (notify.type === 'email') {
        var Email = internals.Notify.settings.notify.plugins.email.plugin;
        var email = new Email(internals.Notify.settings.notify.plugins.email.options);
        var options = {
            to: notify.to,
            subject: notify.subject,
            message: notify.message
        };
        //console.log(options);
        email.notify(options, function (error, info) {

//            if (error) {
            return callback({'status': 'failed', 'message': error});
//            }
//            else {
//                return callback({'status': 'success', 'message': info});
//            }
        });
    }
    else {
        return callback({'status': 'failed', 'message': 'no valid notify type'});
    }
};
