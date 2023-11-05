'use strict'
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
var validSchedules = [];
var validScheduleCount = 0;
var possibleOpponentNames = {};
var maxDups = 1;


scheduleGames(process.argv);


async function scheduleGames(args) {
    info = YAML.parse(fs.readFileSync('./info.yaml', 'utf8'));
    switch (args.length) {
    case 3:
        league = args[2];
        maxDups = 1;
        outerLoop = 1000;
        innerLoop = 1000;
        break;
    case 4:
        league = args[2];
        maxDups = parseInt(args[3]);
        outerLoop = 1000;
        innerLoop = 1000;
        break;
    case 6:
        league = args[2];
        maxDups = parseInt(args[3]);
        outerLoop = parseInt(args[4]);
        innerLoop = parseInt(args[5]);
        break;
    }

    console.error('Using:');
    console.error('  maxDups: ' + maxDups);
    console.error('  outerLoop: ' + outerLoop);
    console.error('  innerLoop: ' + innerLoop);
    generateSchedules(league);
}


function generateSchedules(l) {
    league = l;
    teams = _.filter(info.teams, { league: league });
    weeks = _.filter(info.weeks, { league: league });
    let totalScheduleCount = 0;
    validScheduleCount = 0;
    for (let i = 0; i < outerLoop; i++) {
        if (i % (outerLoop / 10) === 0) {
            console.log(league + ': ' + i);
        }


        // p('Starting: ' + i);


        // This might be the nth try at the schedule, so:
        // 1. Re-init the schedule to empty
        // 2. Reset the available games per week to the default max
        schedule = [];
        for (let week of weeks) {
            week.gamesAvailable = week.maximumGames;
        }


        // Scheduled FIXED HOME GAMES
        for (let team of _.filter(teams, o => o.homeGameWeeks.length > 0)) {
            for (let week of team.homeGameWeeks) {
                scheduleFixedHomeGame(week, team.name);
            }
        }


        // Scheduled FIXED AWAY GAMES
        for (let team of _.filter(teams, o => o.awayGameWeeks.length > 0)) {
            for (let week of team.awayGameWeeks) {
                scheduledFixedAwayGame(week, team.name);
            }
        }
        // y4(_.sortBy(schedule, 'week'));


        // Scheduled REMAINING FLEXIBLE HOME GAMES
        let failure = false;
        for (let team of _.shuffle(teams)) {
            if (scheduleFlexibleHomeGames(team.name, 4 - team.homeGameWeeks.length, _.find(teams, { name: team.name }).byeWeeks)) {
                continue;
            }
            failure = true;
            break;
        }
        if (failure) {
            totalScheduleCount++;
            continue;
        }


        // Just some debugging code to verify everything's working
        // for (let team of teams) {
        //     y4(team.name + ': ' + _.filter(schedule, { homeTeam: team.name }).length + ' ' + _.filter(schedule, { awayTeam: team.name }).length);
        // }
        // y4(_.sortBy(schedule, 'week'));


        // Scheduled REMAINING FLEXIBLE AWAY GAMES
        let savedSchedule = _.cloneDeep(schedule);
        for (let j = 0; j < innerLoop; j++) {
            totalScheduleCount++;

            let failure = false;
            for (let team of _.shuffle(_.map(teams, 'name'))) {
                if (scheduleFlexibleAwayTeamOpponents(team)) {
                    continue;
                }
                failure = true;
                break;
            }

            if (!failure && validSchedule()) {
                validScheduleCount++;
                schedule = _.map(schedule, o => _.assign({}, o, { id: validScheduleCount, score: score() }));
                validSchedules = validSchedules.concat(schedule);
            }

            // Compensation, roll back to the schedule before we
            // started scheduling the remaining flexible away games
            // and try again
            schedule = _.cloneDeep(savedSchedule);
        }
    }

    console.log(league + ': Valid: ' + validScheduleCount);
    fs.writeFileSync(league + '.yaml', YAML.stringify(_.sortBy(validSchedules, [ 'league', 'score', 'id', 'week' ])), 'utf8');
}


function scheduleFixedHomeGame(week, team) {
    // y('Fixed Home Game', 'Team: ' + team + '  Week: ' + week);
    schedule.push({
        league: league,
        week: week,
        homeTeam: team,
        awayTeam: null,
        gym: team[0]
    });
    _.find(weeks, { week: week }).gamesAvailable--;
}


function scheduledFixedAwayGame(week, team) {
    // y('Fixed Away Game', 'Team: ' + team + '  Week: ' + week);
    // Assume the state is:
    // Team to be scheduled is X
    // The week has 5 maximum games that may be scheduled
    // Here is what has already been scheduled at this point:=
    // 1. Team a @ b
    // 3. Team TBD @ c
    // 2. Team d @ TBD
    // 4. Available
    // 5. Available
    //
    // As a result, we want a 33% chance that one of these four schedules are the result:
    // 3. Team d @ X (replacing Team d @ TBD)
    // 4. Team TBD @ X (replacing Available)
    // 5. Team TBD @ X (replacing Available)
    let options = [];
    for (let game of _.filter(schedule, o => o.league === league && o.week === week && o.awayTeam === null)) {
        options.push({ homeTeam: game.homeTeam });
    }
    for (let i = _.find(weeks, { week: week }).gamesAvailable; i > 0; i--) {
        options.push({ homeTeam: null });
    }

    let option = _.sample(options);
    if (option.homeTeam === null) {
        schedule.push({
            league: league,
            week: week,
            homeTeam: null,
            awayTeam: team,
        });
        _.find(weeks, { week: week }).gamesAvailable--;
    } else {
        let game = _.find(schedule, { week: week, homeTeam: option.homeTeam });
        game.awayTeam = team;
    }
}


function scheduleFlexibleHomeGames(team, games, excludeWeeks) {
    // p('Flexible Home Games', team);

    for (let game = 1; game <= games; game++) {
        // p('    Game', game);
        let scheduledWeeks = _.map(_.filter(schedule, o => o.homeTeam === team || o.awayTeam === team), 'week');
        let validWeeks = _.difference([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ], scheduledWeeks, excludeWeeks);

        let options = [];
        for (let week of validWeeks) {
            let weekOptions = [];

            // Get all the week's games where there is an away team but no home team yet
            for (let game of _.filter(schedule, o => o.league === league && o.week === week && o.homeTeam === null)) {
                weekOptions.push({ week: week, awayTeam: game.awayTeam });
            }

            // Get all the week's additional possible set of games
            for (let i = _.find(weeks, { week: week }).gamesAvailable; i > 0; i--) {
                weekOptions.push({ week: week, awayTeam: null });
            }

            options.push(...weekOptions)
            // options = [ ...options, ...weekOptions ];
        }

        if (options.length === 0) {
            return false;
        }

        let option = _.sample(options);
        if (option.awayTeam === null) {
            schedule.push({
                league: league,
                week: option.week,
                homeTeam: team,
                awayTeam: null,
                gym: team[0]
            });
            _.find(weeks, { week: option.week }).gamesAvailable--;
        } else {
            let game = _.find(schedule, { league: league, week: option.week, awayTeam: option.awayTeam });
            game.homeTeam = team;
            game.gym = team[0];
        }
    }

    return true;
}


function scheduleFlexibleAwayTeamOpponents(team) {
    // p('Flexible Away Games', team);

    // Iterate through all the home games for the team where there is not yet an opponent
    let homeGamesWithoutAnOpponent = _.shuffle(_.filter(schedule, o => o.league === league && o.homeTeam == team && o.awayTeam === null));
    for (let homeGame of homeGamesWithoutAnOpponent) {
        // p('    week', homeGame.week);


        // Get the complete set of possible opponents ordered
        let possibleOpponents = getPossibleOpponents(team);
        // p('        possibleOpponents', possibleOpponents);


        for (let possibleOpponent of possibleOpponents) {

            // Skip this possible away team if they are already playing a game during the week
            if (_.some(_.cloneDeep(schedule), g => g.week === homeGame.week && (g.homeTeam === possibleOpponent || g.awayTeam === possibleOpponent))) {
                // p('            playing', possibleOpponent);
                continue;
            }

            let team = _.find(teams, { name: possibleOpponent });
            if (_.includes(team.byeWeeks, homeGame.week)) {
                // p('            bye', possibleOpponent);
                continue;
            }

            // p('        scheduling', possibleOpponent);
            homeGame.awayTeam = possibleOpponent;
            break;
        }

        if (!homeGame.awayTeam) {
            // p('        NO OPPONENT FOUND');
            return false;
        }
    }

    return true;
}


function getPossibleOpponents(homeTeam) {
    let possibleNextOpponents = [];

    // Filter so:
    // 1. A team's set of opponents cannot contain itself
    // 2. A team's set of opponents cannot contain a team from the same organization (same first letter)
    let awayTeams = possibleOpponentNames[league + ':' + homeTeam];
    if (!awayTeams) {
        possibleOpponentNames[league + ':' + homeTeam] = _.filter(_.map(teams, 'name'), o => o !== homeTeam && o[0] !== homeTeam[0]);
        awayTeams = possibleOpponentNames[league + ':' + homeTeam];
    }
    for (let awayTeam of awayTeams) {

        // Verify the potential away opponent does not have 4 away games already
        if (_.filter(schedule, { league: league, awayTeam: awayTeam }).length === 4) {
            continue;
        }

        // Determine the number of times the home team hosts the away team, and, vice versa
        let homeAwayGameCount = _.filter(schedule, { league: league, homeTeam: homeTeam, awayTeam: awayTeam }).length;
        if (homeAwayGameCount > 1) {
            continue;
        }

        let awayHomeGameCount = _.filter(schedule, { league: league, homeTeam: awayTeam, awayTeam: homeTeam }).length;
        if (awayHomeGameCount > 1) {
            continue;
        }

        // Away team is valid, but the number of home/away games
        // already between the home team and the away team will help
        // prioritize whether this is the right match.
        possibleNextOpponents.push({
            awayTeam: awayTeam,
            games: homeAwayGameCount + awayHomeGameCount
        });
    }

    let orderedPossibleNextOpponents = _.orderBy(_.shuffle(possibleNextOpponents), [ 'games' ], [ 'asc' ]);
    p('        orderedPossibleNextOpponents', orderedPossibleNextOpponents);
    return _.map(orderedPossibleNextOpponents, 'awayTeam');
}


function validSchedule() {
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


function score() {
    let score = 0;
    let teamNames = _.map(teams, 'name');
    for (let team of teamNames) {

        for (let homeGame of _.filter(schedule, { league: league, homeTeam: team })) {
            p4('homeGame', homeGame);

            let gameCount = _.filter(schedule, { league: league, homeTeam: team }).length;
            p4('gameCount', gameCount);
            switch (gameCount) {
            case 0:
            case 1:
                break;
            case 2:
                score += 4;
            }

            let awayHomeGameCount = _.filter(schedule, { league: league, homeTeam: homeGame.awayTeam, awayTeam: team }).length;
            p4('awayHomeGameCount', awayHomeGameCount);
            switch (awayHomeGameCount) {
            case 0:
                break;
            case 1:
                score += 1;
                break;
            case 2:
                score += 4;
                break;
            }
        }
    }
    return score;
}
