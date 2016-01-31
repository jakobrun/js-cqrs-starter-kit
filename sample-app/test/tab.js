'use strict';
const {given} = require('./bdd');
const {openTab, placeOrder, markDrinksServed} = require('../cafe/commands');
const {tabOpened, drinksOrdered, foodOrdered, drinksServed} = require('../cafe/events');
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

function createTestDrink2() {
    return {
        menuNumber: 10,
        description: 'Beer',
        price: 2.5,
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

const testTabOpened = () => tabOpened({
    tableNumber: testTable,
    waiter: testWaiter
});

describe('tab', function() {
    it('should open a new tab', function() {
        const openTabCommand = openTab({
            tableNumber: testTable,
            waiter: testWaiter
        });
        given().when(openTabCommand).then(testTabOpened());
    });

    it('should not order with unopened tab', function() {
        given().when(placeOrder({
            items: [createTestDrink1()]
        })).thenFailWith('TabNotOpen');
    });

    it('should place drinks order', function() {
        given(testTabOpened()).when(placeOrder({
            items: [createTestDrink1()]
        })).then(drinksOrdered({
            items: [createTestDrink1()]
        }));
    });

    it('should place food order', function() {
        given(testTabOpened()).when(placeOrder({
            items: [createTestFood1(), createTestFood1()]
        })).then(foodOrdered({
            items: [createTestFood1(), createTestFood1()]
        }));
    });

    it('should place food and drink order', function() {
        given(testTabOpened()).when(placeOrder({
            items: [createTestFood1(), createTestDrink1()]
        })).then(drinksOrdered({
            items: [createTestDrink1()]
        }), foodOrdered({
            items: [createTestFood1()]
        }));
    });

    it('should serve ordered drinks', function() {
        const drink1 = createTestDrink1(),
            drink2 = createTestDrink2();
        given(testTabOpened(), drinksOrdered({
            items: [drink1, drink2]
        })).when(markDrinksServed({
            menuNumbers: [drink1.menuNumber, drink2.menuNumber]
        })).then(drinksServed({
            menuNumbers: [drink1.menuNumber, drink2.menuNumber]
        }))
    });

    it('should not serve unordered drink', function() {
        given(testTabOpened(), drinksOrdered({
            items: [createTestDrink1()]
        })).when(markDrinksServed({
            menuNumbers: [createTestDrink2()]
        })).thenFailWith('DrinksNotOutstanding');
    });

    it('should not serve an ordered drink twice', function() {
        const testDrink1 = createTestDrink1();
        given(testTabOpened(), drinksOrdered({
            items: [testDrink1]
        }), drinksServed({
            menuNumbers: [testDrink1.menuNumber]
        })).when(markDrinksServed({
            menuNumbers: [testDrink1.menuNumber]
        })).thenFailWith('DrinksNotOutstanding');

    });
});
