'use strict';
const {tabOpened} = require('./events');

module.exports = function createTabAggregate() {
    return {
        apply: function(event) {

        },
        openTab: function(command) {
            return [tabOpened(command)];
        }
    }
};
