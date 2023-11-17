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


printRequests(process.argv);


async function printRequests(args) {
    let input = args[2];

    let info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    let leagues = _.uniq(_.map(info.teams, 'league'));

    let master = YAML.parse(fs.readFileSync(input, 'utf8'));

    console.log('-------------------------------------------------------------------------------');


    requestAssociatesg789aBye8And10(master, leagues, info.teams);
    requestAssociatesb45a2Andb6a1(master, leagues, info.teams);
    requestAssociatesNoHome589(master, leagues, info.teams);

    requestJYOg4j1Andb6j2(master, leagues, info.teams);
    requestJYOb7j1(master, leagues, info.teams);
    requestJYONoGames59(master, leagues, info.teams);

    requestTricityg4t2Bye1And2(master, leagues, info.teams);
    requestTricityg56t3Bye4(master, leagues, info.teams);
    requestTricityb89t2Bye1And2(master, leagues, info.teams);
    requestTricityMainAux(master, leagues, info.teams);

    requestCYSb45c1Bye2(master, leagues, info.teams);
    requestCYSNoHome4(master, leagues, info.teams);

    console.log('All Ok');
}


function requestTricityg4t2Bye1And2(master, leagues, teams) {
    for (let week of [ 1, 2 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if (game.league === 'g4' && (game.homeTeam === 't2' || game.awayTeam === 't2')) {
                    console.error('g4:t2 is not bye on week 1 and/or 2');
                    exit();
                }
            }
        }
    }
    console.log('g4:t2 is bye on week 1 and/or 2');
    console.log('-------------------------------------------------------------------------------');
}


function requestTricityg56t3Bye4(master, leagues, teams) {
    for (let week of [ 4 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if (game.league === 'g56' && (game.homeTeam === 't3' || game.awayTeam === 't3')) {
                    console.error('g56:t3 is not bye on week 4');
                    exit();
                }
            }
        }
    }
    console.log('g56:t3 is bye on week 4');
    console.log('-------------------------------------------------------------------------------');
}


function requestTricityb89t2Bye1And2(master, leagues, teams) {
    for (let week of [ 1, 2 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if (game.league === 'b89' && (game.homeTeam === 't2' || game.awayTeam === 't2')) {
                    console.error('b89:t2 is not bye on week 1 and 2');
                    exit();
                }
            }
        }
    }
    console.error('b89:t2 is bye on week 1 and 2');
    console.log('-------------------------------------------------------------------------------');
}


function requestAssociatesg789aBye8And10(master, leagues, teams) {
    for (let week of [ 8, 10 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if (game.league === 'g789' && (game.homeTeam === 'a' || game.awayTeam === 'a')) {
                    console.error('g789:a is not bye on week 8 and/or 10');
                    exit();
                }
            }
        }
    }
    console.error('g789:a is bye on week 8 and/or 10');
    console.log('-------------------------------------------------------------------------------');
}


function requestCYSb45c1Bye2(master, leagues, teams) {
    for (let week of [ 2 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if (game.league === 'b45' && (game.homeTeam === 'c1' || game.awayTeam === 'c1')) {
                    console.error('b45:c1 is not bye on week 2');
                    exit();
                }
            }
        }
    }
    console.error('b45:c1 is bye on week 2');
    console.log('-------------------------------------------------------------------------------');
}


function requestJYOg4j1Andb6j2(master, leagues, teams) {

    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if ((game.league === 'g4' && (game.homeTeam === 'j1' || game.awayTeam === 'j1')) ||
                    (game.league === 'b6' && (game.homeTeam === 'j2' || game.awayTeam === 'j2'))) {
                    process.stdout.write(('Week ' + game.week.toString()).padEnd(8));
                    process.stdout.write(weekToDate(week).padEnd(10));
                    process.stdout.write(game.league.padEnd(5));
                    process.stdout.write((awayTeam.name + '@' + homeTeam.name).padEnd(8));
                    process.stdout.write(game.location.time.padEnd(10));
                    process.stdout.write(game.location.name.padEnd(30));
                    console.log();
                }
            }
        }
        console.log();
    }
    console.log('-------------------------------------------------------------------------------');
}


function requestAssociatesb45a2Andb6a1(master, leagues, teams) {

    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if ((game.league === 'b45' && (game.homeTeam === 'a2' || game.awayTeam === 'a2')) ||
                    (game.league === 'b6' && (game.homeTeam === 'a1' || game.awayTeam === 'a1'))) {
                    process.stdout.write(('Week ' + game.week.toString()).padEnd(8));
                    process.stdout.write(weekToDate(week).padEnd(10));
                    process.stdout.write(game.league.padEnd(5));
                    process.stdout.write((awayTeam.name + '@' + homeTeam.name).padEnd(8));
                    process.stdout.write(game.location.time.padEnd(10));
                    process.stdout.write(game.location.name.padEnd(30));
                    console.log();
                }
            }
        }
        console.log();
    }
    console.log('-------------------------------------------------------------------------------');
}


function requestJYOb7j1(master, leagues, teams) {

    for (let week of [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if ((game.league === 'b7' && (game.homeTeam === 'j1' || game.awayTeam === 'j1'))) {
                    process.stdout.write(('Week ' + game.week.toString()).padEnd(8));
                    process.stdout.write(weekToDate(week).padEnd(10));
                    process.stdout.write(game.league.padEnd(5));
                    process.stdout.write((awayTeam.name + '@' + homeTeam.name).padEnd(8));
                    process.stdout.write(game.location.time.padEnd(10));
                    process.stdout.write(game.location.name.padEnd(30));
                    console.log();
                }
            }
        }
    }
    console.log('-------------------------------------------------------------------------------');
}


function requestTricityMainAux(master, leagues, teams) {

    for (let week of [ 1, 2 ]) {
        for (let gym of [ 't' ]) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                process.stdout.write((awayTeam.name + '@' + homeTeam.name).padEnd(8));
                process.stdout.write(game.league.padEnd(5));
                process.stdout.write(game.location.time.padEnd(10));
                process.stdout.write(game.location.name.padEnd(30));
                console.log();
            }
        }
        console.log();
    }
    console.log('-------------------------------------------------------------------------------');
}


function requestCYSNoHome4(master, leagues, teams) {

    for (let week of [ 4 ]) {
        for (let gym of [ 'c' ]) {
            let games = _.filter(master, { week: week, gym: gym });
            if (games.length > 0) {
                console.error('CYS home games are scheduled on week 4');
            }
        }
    }
    console.error('No CYS home games are scheduled on week 4');
    console.log('-------------------------------------------------------------------------------');
}


function requestAssociatesNoHome589(master, leagues, teams) {

    for (let week of [ 5, 8, 9 ]) {
        for (let gym of [ 'a' ]) {
            let games = _.filter(master, { week: week, gym: gym });
            if (games.length > 0) {
                console.error('Associates home games are scheduled on weeks 5, 8, and/or 9');
            }
        }
    }
    console.error('No Associates home games are scheduled on weeks 5, 8, and/or 9');
    console.log('-------------------------------------------------------------------------------');
}


function requestJYONoGames59(master, leagues, teams) {

    for (let week of [ 5, 9 ]) {
        for (let gym of _.uniq(_.map(_.filter(master, { week: week }), 'gym'))) {
            let games = _.filter(master, { week: week, gym: gym });
            for (let game of games) {
                let homeTeam = _.find(teams, { name: game.homeTeam });
                let awayTeam = _.find(teams, { name: game.awayTeam });
                if (homeTeam[0] === 'j' || awayTeam[0] === 'j') {
                    console.error('JYO should have no games weeks 5 and 9');
                }
            }
        }
    }
    console.error('JYO has no games weeks 5 and 9');
    console.log('-------------------------------------------------------------------------------');
}
