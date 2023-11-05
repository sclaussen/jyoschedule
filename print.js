'use strict'
process.env.DEBUG='print'
const d = require('debug')('print');

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


var ids = {
    g4: 1,
    g56: 1,
    g789: 1,
    b45: 1,
    b6: 1,
    b7: 1,
    b89: 1,
};


print(process.argv);


async function print(args) {
    // let leagues = [ 'g4', 'g56', 'g789', 'b6', 'b7', 'b89' ];
    let leagues = [ 'g4', 'g56', 'g789', 'b45', 'b6', 'b7', 'b89' ];
    let schedules = {};
    for (let league of leagues) {
        schedules[league] = YAML.parse(fs.readFileSync(league + '.yaml', 'utf8'));
    }

    for (let league of leagues) {
        let schedule = _.filter(schedules[league], { id: ids[league] });
        printNormalized(league, schedule);
        console.log();
        console.log();
        console.log();
        console.log();
        console.log();
    }
}


function printNormalized(league, schedule) {
    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        let games = _.filter(schedule, { league: league, week: week });
        for (let game of games) {
            console.log(league.padEnd(10) + '\t' + week.toString().padEnd(4) + '\t' + game.homeTeam.padEnd(4) + '\t' + (game.awayTeam || '').padEnd(4) + '\t' + game.homeTeam[0]);
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
