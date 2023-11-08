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
const weekToDate = require('./lib/weekToDate');
const exit = require('./lib/exit');


printByLocation(process.argv);


async function printByLocation(args) {
    let input = args[2];

    let info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    let leagues = _.uniq(_.map(info.teams, 'league'));

    let master = YAML.parse(fs.readFileSync(input, 'utf8'));
    generateLocation(master);
}


function generateLocation(master) {

    // // Header line 1
    // process.stdout.write(''.padEnd(30) + '\t');
    // for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
    //     process.stdout.write(left('Week ' + week.toString(), 30) + '\t');
    // }
    // console.log();

    // // Header line 2
    // process.stdout.write(''.padEnd(30) + '\t');
    // for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
    //     process.stdout.write(left(weekToDate(week).toString(), 30) + '\t');
    // }
    // console.log();


    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                process.stdout.write(game.week.toString().padEnd(4) + '\t');
                process.stdout.write(weekToDate(week).padEnd(8) + '\t');
                process.stdout.write(game.league.padEnd(10) + '\t');
                process.stdout.write(game.awayTeam.padEnd(4) + '\t');
                process.stdout.write(game.homeTeam.padEnd(4) + '\t');
                if ('location' in game) {
                    process.stdout.write(game.location.time.padEnd(5) + '\t' );
                    process.stdout.write(('=hyperlink("' + game.location.map + '", "' + game.location.name + '")').padEnd(30) + '\t');
                    // process.stdout.write('\t' + game.location.time.padEnd(5) + '\t' + game.location.name.padEnd(25) + '\t' + game.location.address.padEnd(50) + '\t' + game.location.map.padEnd(20));
                }
                console.log();
            }
        }
    }
}


function center(s, width, ch = ' ') {
    const left = Math.floor((width - s.length) / 2);
    const right = width - s.length - left;
    return ch.repeat(left) + s + ch.repeat(right);
}


function left(s, width, ch = ' ') {
    return s.padEnd(width);
}
