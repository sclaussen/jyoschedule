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


printMaster(process.argv);


async function printMaster(args) {
    let input = args[2];

    let info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    let leagues = _.uniq(_.map(info.teams, 'league'));

    let master = YAML.parse(fs.readFileSync(input, 'utf8'));

    generateMaster(master, leagues, info.teams);
}


function generateMaster(master, leagues, teams) {

    // Header line 1
    process.stdout.write(''.padEnd(30) + '\t');
    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        process.stdout.write(left('Week ' + week.toString(), 30) + '\t');
    }
    console.log();

    // Header line 2
    process.stdout.write(''.padEnd(30) + '\t');
    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        process.stdout.write(left(weekToDate(week).toString(), 30) + '\t');
    }
    console.log();
    console.log();


    for (let league of leagues) {
        let schedule = _.filter(master, { league: league });

        for (let team of _.map(_.filter(teams, { league: league }), 'name')) {

            // Line 1
            process.stdout.write(leagueFull(league).padEnd(30) + '\t');
            for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
                let game = _.find(schedule, o => o.week ===  week && (o.homeTeam === team || o.awayTeam === team));
                if (!game) {
                    process.stdout.write('bye'.padEnd(30) + '\t');
                    continue;
                }

                if (game.homeTeam === team) {
                    process.stdout.write((game.location.time + ' vs. ' + teamFull(_.find(teams, { name: game.awayTeam })) + ' (Home)').padEnd(30) + '\t');
                } else {
                    process.stdout.write((game.location.time + ' vs. ' + teamFull(_.find(teams, { name: game.homeTeam })) + ' (Away)').padEnd(30) + '\t');
                }
            }
            console.log();


            // Line 2
            process.stdout.write(teamFull(_.find(teams, { name: team })).padEnd(30) + '\t');
            for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
                let game = _.find(schedule, o => o.week ===  week && (o.homeTeam === team || o.awayTeam === team));
                if (!game) {
                    process.stdout.write(''.padEnd(30) + '\t');
                    continue;
                }
                process.stdout.write(('=hyperlink("' + game.location.map + '", "' + game.location.name + '")').padEnd(30) + '\t');
            }
            console.log();


            // // Line 3
            // process.stdout.write(''.padEnd(30) + '\t');
            // for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
            //     let game = _.find(schedule, o => o.week ===  week && (o.homeTeam === team || o.awayTeam === team));
            //     if (!game) {
            //         process.stdout.write(''.padEnd(30) + '\t');
            //         continue;
            //     }

            //     process.stdout.write(game.location.name.padEnd(30) + '\t');
            // }
            // console.log();

            // // Line 4
            // process.stdout.write(''.padEnd(30) + '\t');
            // for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
            //     let game = _.find(schedule, o => o.week ===  week && (o.homeTeam === team || o.awayTeam === team));
            //     if (!game) {
            //         process.stdout.write(''.padEnd(30) + '\t');
            //         continue;
            //     }

            //     process.stdout.write(game.location.address.padEnd(30) + '\t');
            // }
            // console.log();

            // // Line 5
            // process.stdout.write(''.padEnd(30) + '\t');
            // for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
            //     let game = _.find(schedule, o => o.week ===  week && (o.homeTeam === team || o.awayTeam === team));
            //     if (!game) {
            //         process.stdout.write(''.padEnd(30) + '\t');
            //         continue;
            //     }

            //     process.stdout.write(game.location.map.padEnd(30) + '\t');
            // }
            console.log();
            console.log();

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
