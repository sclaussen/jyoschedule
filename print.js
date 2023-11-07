'use strict'
//process.env.DEBUG = 'print,always';
process.env.DEBUG = 'always';
const d = require('debug')('print');
const d2 = require('debug')('always');

const fs = require('fs');
const util = require('util');
const _ = require('lodash');

const YAML = require('yaml');

const p = require('./lib/pr').p(d);
const e = require('./lib/pr').e(d);
const p4 = require('./lib/pr').p4(d);
const p4always = require('./lib/pr').p4(d2);
const y = require('./lib/pr').y(d);
const y4 = require('./lib/pr').y4(d);
const exit = require('./lib/exit');


var orgs = {
    a: 'Associates',
    c: 'CYS',
    j: 'JYO',
    t: 'TriCity',
    y: 'YAO',
};


var ids = {
    g4: 2,
    g56: 4,
    g789: 1,
    b45: 1,
    b6: 4,
    b7: 4,
    b89: 1
};

var failures {};


var maxgyms;


print(process.argv);


async function print(args) {
    // let info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    // maxgyms = info.maxgyms;

    let leagues = [ 'g4', 'g56', 'g789', 'b6', 'b7', 'b89' ];
    // let leagues = [ 'g4', 'g56', 'g789', 'b45', 'b6', 'b7', 'b89' ];

    // Read all N generated scheduled for each of the leagues
    let schedules = {};
    for (let league of leagues) {
        schedules[league] = YAML.parse(fs.readFileSync(league + '.yaml', 'utf8'));
    }
}


function printMaxGyms() {
    process.stdout.write(''.padEnd(10));
    for (let org of _.keys(orgs)) {
        process.stdout.write(org.padEnd(10));
    }
    console.log();
    process.stdout.write(''.padEnd(10));
    for (let org of [ 'm/a', 'm/a', 'm/a', 'm/a', 'm/a' ]) {
        process.stdout.write(org.padEnd(10));
    }
    console.log();

    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        process.stdout.write(''.padEnd(10));
        for (let org of _.keys(orgs)) {
            let gym = _.find(maxgyms, { week: week, name: org });
            let s = gym.maximum.toString() + '/' + gym.available.toString();
            process.stdout.write(s.padEnd(10));
        }
        console.log();
    }
}


function printNormalized(league, schedule) {
    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        let games = _.filter(schedule, { league: league, week: week });
        for (let game of games) {
            console.log(league.padEnd(10) + '\t' + week.toString().padEnd(4) + '\t' + game.homeTeam.padEnd(4) + '\t' + (game.awayTeam || '').padEnd(4) + '\t' + game.gym);
        }
    }
}


function printHome() {
    for (let team of _.map(teams, 'name')) {
        process.stdout.write(team.padEnd(10));
        for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
            let games = _.filter(schedule, o => o.league === league && o.week === week && o.homeTeam === team);
            if (games.length > 0) {
                process.stdout.write(week.toString().padEnd(9));
            }
            else {
                process.stdout.write('-'.padEnd(9));
            }
        }
        console.log();
    }
}


function printMatrix() {
    let teamNames = _.map(teams, 'name');

    process.stdout.write(''.padEnd(10));
    for (let team of teamNames) {
        process.stdout.write(team.padEnd(10));
    }
    console.log();

    for (let team of teamNames) {
        process.stdout.write(team.padEnd(10));
        for (let awayTeam of teamNames) {
            if (team === awayTeam) {
                process.stdout.write('-'.padEnd(10));
            }
            let count = _.filter(schedule, { league: league, homeTeam: team, awayTeam: awayTeam }).length;
            switch (count) {
            case 0:
                process.stdout.write(''.toString().padEnd(10));
                break;
            case 1:
                process.stdout.write(count.toString().padEnd(10));
                break;
            case 2:
                process.stdout.write(count.toString().padEnd(10));
                break;
            }
        }
        console.log();
    }
}


function printStats() {
    for (let team of _.map(teams, 'name')) {
        process.stdout.write(team.padEnd(10));
        for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
            let games = _.filter(schedule, o => o.league === league && o.week ===  week && (o.homeTeam === team || o.awayTeam === team));
            if (games.length > 0) {
                for (let game of games) {
                    if (game.homeTeam === team) {
                        process.stdout.write(game.awayTeam.padEnd(9));
                    } else {
                        process.stdout.write(game.homeTeam.padEnd(3) + '(A)   ');
                    }
                }
            }
            else {
                process.stdout.write('-'.padEnd(9));
            }
        }
        console.log();
    }
}



function validSchedule(schedule, league, teams) {
    let teamNames = _.map(teams, 'name');
    for (let homeTeam of teamNames) {
        for (let awayTeam of teamNames) {
            let dups = _.filter(schedule, { league: league, homeTeam: homeTeam, awayTeam: awayTeam }).length;
            if (dups > maxDups) {
                return false;
            }
        }
    }
    return true;
}
