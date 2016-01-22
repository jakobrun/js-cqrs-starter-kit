'use strict';
const {given} = require('./bdd');
const {openTab} = require('../cafe/commands');
const {tabOpened} = require('../cafe/events');
const testTable = 42;
const testWatier = 'Derek';

describe('tab', function() {
    it('should open a new tab', function() {
        given().when(openTab({
            tableNumber: testTable,
            waiter: testWatier
        })).then(tabOpened({
            tableNumber: testTable,
            waiter: testWatier
        }));
    });
});
