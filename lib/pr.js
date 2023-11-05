'use strict';


const d = require('debug')('pr');
const YAML = require('yaml');


function p(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d(label + ': ' + JSON.stringify(value));
            return;
        }

        if (typeof label === 'object') {
            d(JSON.stringify(label));
            return;
        }

        d(label);
    };
}


function p4(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d(label + ': ' + JSON.stringify(value, null, 4));
            return;
        }

        d(JSON.stringify(label, null, 4));
    };
}


function y(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d(label + ': ' + JSON.stringify(value));
            return;
        }

        d(YAML.stringify(label));
    };
}


function y4(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d(label + ': ' + JSON.stringify(value, null, 4));
            return;
        }

        d(YAML.stringify(label, null, 4));
    };
}


function e(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d('Entering: ' + label + ': ' + JSON.stringify(value));
            return;
        }

        d('Entering: ' + label);
    };
}


function e4(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d('Entering: ' + label + ': ' + JSON.stringify(value, null, 4));
            return;
        }

        d('Entering: ' + label);
    };
}


function ex(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d('Exiting: ' + label + ': ' + JSON.stringify(value));
            return;
        }

        d('Exiting: ' + label);
    };
}


function ex4(d) {
    return function(label, value) {

        if (!d.enabled) {
            return;
        }

        if (value) {
            d('Exiting: ' + label + ': ' + JSON.stringify(value, null, 4));
            return;
        }

        d('Exiting: ' + labele);
    };
}


module.exports.p = p;
module.exports.p4 = p4;
module.exports.y = y;
module.exports.y4 = y4;
module.exports.e = e;
module.exports.e4 = e4;
module.exports.ex = ex;
module.exports.ex4 = ex4;
