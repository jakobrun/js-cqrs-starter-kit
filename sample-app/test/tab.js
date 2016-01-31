'use strict';
const {given} = require('./bdd');
const {openTab, placeOrder} = require('../cafe/commands');
const {tabOpened, drinksOrdered, foodOrdered} = require('../cafe/events');
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

function createTestFood1() {
    return {
        menuNumber: 16,
        description: 'Beef Noodles',
        price: 7.5,
        type: 'food'
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
    });

    it('should place drinks order', function() {
        given(tabOpened({
            tableNumber: testTable,
            waiter: testWaiter
        })).when(placeOrder({
            items: [createTestDrink1()]
        })).then(drinksOrdered({
            items: [createTestDrink1()]
        }));
    });

    it('should place food order', function() {
        given(tabOpened({
            tableNumber: testTable,
            waiter: testWaiter
        })).when(placeOrder({
            items: [createTestFood1(), createTestFood1()]
        })).then(foodOrdered({
            items: [createTestFood1(), createTestFood1()]
        }));
    });
});
