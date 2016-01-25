'use strict';
const {given} = require('./bdd');
const {openTab, placeOrder} = require('../cafe/commands');
const {tabOpened} = require('../cafe/events');
const testTable = 42;
const testWaiter = 'Derek';

function createTestDrink1() {
    return {
        menuNumber: 4,
        description: 'Sprite',
        price: 1.5,
        type: 'drink'
    };
}

describe('tab', function() {
    it('should open a new tab', function() {
        const openTabCommand = openTab({
            tableNumber: testTable,
            waiter: testWaiter
        });
        given().when(openTabCommand).then(tabOpened({
            tableNumber: testTable,
            waiter: testWaiter
        }));
    });

    it('should not order with unopened tab', function() {
        given().when(placeOrder({
            items: [createTestDrink1()]
        })).thenFailWith('TabNotOpen');
    })
});
