'use strict'
process.env.DEBUG = 'schedule';
const d = require('debug')('schedule');

const fs = require('fs');
const util = require('util');
const _ = require('lodash');

const YAML = require('yaml');

const p = require('./lib/pr').p(d);
const e = require('./lib/pr').e(d);
const p4 = require('./lib/pr').p4(d);
const y = require('./lib/pr').y(d);
const y4 = require('./lib/pr').y4(d);
const exit = require('./lib/exit');


var info;
var schedule = [];
var teams;
var weeks;
var league;
var outerLoop;
var innerLoop;


scheduleGames(process.argv);


async function scheduleGames(args) {
    info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    for (let team of info.teams) {
        if (team.byeWeeks.length === 0 && team.homeGameWeeks.length === 0 && team.awayGameWeeks.length === 0) {
            continue;
        }
        console.log(team.league + ':' + team.name);
        if (team.byeWeeks.length > 0) {
            console.log('    Byes: ' + team.byeWeeks);
        }
        if (team.homeGameWeeks.length > 0) {
            console.log('    Home weeks: ' + team.homeGameWeeks);
        }
        if (team.awayGameWeeks.length > 0) {
            console.log('    Away weeks: ' + team.awayGameWeeks);
        }
        console.log('    Notes: ' + team.notes);
    }
}
