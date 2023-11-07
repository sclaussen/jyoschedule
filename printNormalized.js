'use strict'
process.env.DEBUG = 'schedule';
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


print(process.argv);


async function print(args) {

    let input = args[2];

    let info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    let leagues = _.uniq(_.map(info.teams, 'league'));

    let master = YAML.parse(fs.readFileSync(input, 'utf8'));
    for (let league of leagues) {
        printNormalized(league, _.filter(master, { league: league }));
    }
}


function printNormalized(league, schedule) {
    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        let games = _.filter(schedule, { week: week });
        for (let game of games) {
            process.stdout.write(league.padEnd(10) + '\t' + week.toString().padEnd(4) + '\t' + game.homeTeam.padEnd(4) + '\t' + (game.awayTeam || '').padEnd(4) + '\t' + game.gym);
            if ('location' in game) {
                process.stdout.write('\t' + game.location.time.padEnd(5) + '\t' + game.location.name.padEnd(25));
                // process.stdout.write('\t' + game.location.time.padEnd(5) + '\t' + game.location.name.padEnd(25) + '\t' + game.location.address.padEnd(50) + '\t' + game.location.map.padEnd(20));
            }
            console.log();
        }
    }
}
