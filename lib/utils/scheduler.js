var FishHook = require('fishhook');

var internals = {};

module.exports = function (options) {

    var scheduler = new FishHook(options);
    this.stopScheduler = scheduler.stopScheduler;
    this.startScheduler = scheduler.startScheduler;
    this.stopSchedule = scheduler.stopSchedule;
    this.startSchedule = scheduler.startSchedule;
    this.getSchedule = scheduler.getSchedule;
    this.getSchedules = scheduler.getSchedules;
};
