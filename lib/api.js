'use strict';

const Job = require('./api/job');
const Run = require('./api/run');
const Reel = require('./api/reel');
const User = require('./api/user');

const internals = {};

module.exports = internals.Api = function (options) {

    this.settings = options;
    const job = new Job(options);
    const run = new Run(options);
    const reel = new Reel(options);
    const user = new User(options);
    this.Job = job;
    this.Run = run;
    this.Reel = reel;
    this.User = user;
    //console.log('settings');
    //console.log(this.settings);
};
