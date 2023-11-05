'use strict'
const d = require('debug')('opt');

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


var org = {
    a: 'Associates',
    c: 'CYS',
    j: 'JYO',
    t: 'TriCity',
    y: 'YAO',
};


var bs = {
    g4: 1,
    g56: 92,
    g789: 1,
    b45: 1,
    b6: 1,
    b7: 1,
    b89: 1,
};


opt(process.argv);


async function opt(args) {
    // let leagues = [ 'g4', 'g56', 'g789', 'b45', 'b6', 'b7', 'b89' ];
    let leagues = [ 'g4', 'g56', 'g789', 'b6', 'b7', 'b89' ];
    let schedules = {};
    let counts = {};
    for (let league of leagues) {
        schedules[league] = YAML.parse(fs.readFileSync(league + '.yaml', 'utf8'));
        counts[league] = _.uniq(_.map(schedules[league], 'count'));
    }

    let countCombinations = [];
    for (let g4Count of counts.g4) {
        for (let g56Count of counts.g56) {
            for (let g789Count of counts.g789) {
                for (let b45Count of [ 'x' ]) {
                    for (let b6Count of counts.b6) {
                        for (let b7Count of counts.b7) {
                            for (let b89Count of counts.b89) {
                                tryCombination(schedules, {
                                    g4: g4Count,
                                    g56: g56Count,
                                    g789: g789Count,
                                    b45: b45Count,
                                    b6: b6Count,
                                    b7: b7Count,
                                    b89: b89Count,
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}


function tryCombination(schedules, combination) {
    p(combination);
    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        for (let gym of [ 'a', 'c', 'j', 't', 'y' ]) {
    _.filter(schedule.g4, { count: g4Count, week
}
