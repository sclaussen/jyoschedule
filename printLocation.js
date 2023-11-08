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
const weekToDate = require('./lib/util').weekToDate;
const orgFull = require('./lib/util').orgFull;
const teamFull = require('./lib/util').teamFull;
const leagueFull = require('./lib/util').leagueFull;
const exit = require('./lib/exit');


printByLocation(process.argv);


async function printByLocation(args) {
    let input = args[2];

    let info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    let leagues = _.uniq(_.map(info.teams, 'league'));

    let master = YAML.parse(fs.readFileSync(input, 'utf8'));
    generateLocation(master, leagues, info.teams);
}


function generateLocation(master, leagues, teams) {

    console.log('Week'.padEnd(7) + '\tDate'.padEnd(8) + '\tLocation'.padEnd(30) + '\tTime'.padEnd(8) + '\tLeague'.padEnd(2) + '\tAway Team'.padEnd(8) + '\tHome Team'.padEnd(8));
    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                process.stdout.write('Week ' + game.week.toString().padEnd(7) + '\t');
                process.stdout.write(weekToDate(week).padEnd(8) + '\t');
                process.stdout.write(('=hyperlink("' + game.location.map + '", "' + game.location.name + '")').padEnd(30) + '\t');
                process.stdout.write(game.location.time.padEnd(7) + '\t' );
                process.stdout.write(leagueFull(game.league).padEnd(20) + '\t');
                process.stdout.write(teamFull(awayTeam, game.awayTeam).padEnd(8) + '\t');
                process.stdout.write('@' + teamFull(homeTeam, game.homeTeam).padEnd(8) + '\t');
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
