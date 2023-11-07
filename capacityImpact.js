'use strict'
// process.env.DEBUG = 'schedule';
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


capacitySummary(process.argv);


async function capacitySummary(args) {
    let leagueData = {
        g4: {},
        g56: {},
        g789: {},
        b45: {},
        b6: {},
        b7: {},
        b89: {},
    };

    let info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    let leagues = _.uniq(_.map(info.teams, 'league'));

    // Read all N generated scheduled for each of the leagues
    let schedules = {};
    for (let league of leagues) {
        schedules[league] = YAML.parse(fs.readFileSync(league + '.yaml', 'utf8'));
        leagueData[league].schedule = _.filter(schedules[league], { id: leagueData[league].id });
    }

    for (let league of leagues) {
        for (let id = 1; id <= 20; id++) {
            let schedule = _.filter(schedules[league], { id: id });
            for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
                for (let game of _.filter(schedule, { week: week })) {
                }



        schedules[league] = YAML.parse(fs.readFileSync(league + '.yaml', 'utf8'));
        leagueData[league].schedule =
    }
}
