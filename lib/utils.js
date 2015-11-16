'use strict';

const Angler = require('angler');
const Bait = require('bait');
const Reel = require('reel');

const internals = {};

module.exports = internals.Utils = function (options) {

    const bait = new Bait(options.job);
    this.Job = bait;
    const reel = new Reel(options.reel);
    this.Reel = reel;
    const user = new Angler(options.user);
    this.User = user;
};
