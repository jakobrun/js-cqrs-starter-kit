'use strict';
const {given} = require('./bdd');
const {openTab, placeOrder, markDrinksServed, markFoodPrepared, markFoodServed, closeTab} = require('../cafe/commands');
const {tabOpened, drinksOrdered, foodOrdered, drinksServed, foodPrepared, foodServed, tabClosed} = require('../cafe/events');
const testTable = 42;
const testId = require('node-uuid').v4();
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

function createTestFood2() {
    return {
        menuNumber: 25,
        description: 'Vegetable Curry',
        price: 6.0,
        type: 'food'
    };
}

const testTabOpened = () => tabOpened({
    tabId: testId,
    tableNumber: testTable,
    waiter: testWaiter
});

describe('tab', function() {
    it('should open a new tab', function() {
        const openTabCommand = openTab({
            tabId: testId,
            tableNumber: testTable,
            waiter: testWaiter
        });
        given().when(openTabCommand).then(testTabOpened());
    });

    it('should not order with unopened tab', function() {
        given().when(placeOrder({
            tabId: testId,
            items: [createTestDrink1()]
        })).thenFailWith('TabNotOpen');
    });

    it('should place drinks order', function() {
        given(testTabOpened()).when(placeOrder({
            tabId: testId,
            items: [createTestDrink1()]
        })).then(drinksOrdered({
            tabId: testId,
            items: [createTestDrink1()]
        }));
    });

    it('should place food order', function() {
        given(testTabOpened()).when(placeOrder({
            tabId: testId,
            items: [createTestFood1(), createTestFood1()]
        })).then(foodOrdered({
            tabId: testId,
            items: [createTestFood1(), createTestFood1()]
        }));
    });

    it('should place food and drink order', function() {
        given(testTabOpened()).when(placeOrder({
            tabId: testId,
            items: [createTestFood1(), createTestDrink1()]
        })).then(drinksOrdered({
            tabId: testId,
            items: [createTestDrink1()]
        }), foodOrdered({
            tabId: testId,
            items: [createTestFood1()]
        }));
    });

    it('should serve ordered drinks', function() {
        const drink1 = createTestDrink1(),
            drink2 = createTestDrink2();
        given(testTabOpened(), drinksOrdered({
            tabId: testId,
            items: [drink1, drink2]
        })).when(markDrinksServed({
            tabId: testId,
            menuNumbers: [drink1.menuNumber, drink2.menuNumber]
        })).then(drinksServed({
            tabId: testId,
            menuNumbers: [drink1.menuNumber, drink2.menuNumber]
        }))
    });

    it('should not serve unordered drink', function() {
        given(testTabOpened(), drinksOrdered({
            tabId: testId,
            items: [createTestDrink1()]
        })).when(markDrinksServed({
            tabId: testId,
            menuNumbers: [createTestDrink2()]
        })).thenFailWith('DrinksNotOutstanding');
    });

    it('should not serve an ordered drink twice', function() {
        const testDrink1 = createTestDrink1();
        given(testTabOpened(), drinksOrdered({
            tabId: testId,
            items: [testDrink1]
        }), drinksServed({
            tabId: testId,
            menuNumbers: [testDrink1.menuNumber]
        })).when(markDrinksServed({
            tabId: testId,
            menuNumbers: [testDrink1.menuNumber]
        })).thenFailWith('DrinksNotOutstanding');
    });

    it('should mark food prepared', function() {
        const testFood1 = createTestFood1();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1, testFood1]
        })).when(markFoodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood1.menuNumber]
        })).then(foodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood1.menuNumber]
        }))
    });

    it('should not mark food prepared if it has not been ordered', function() {
        given(testTabOpened()).when(markFoodPrepared({
            tabId: testId,
            menuNumbers: [createTestFood2()]
        })).thenFailWith('FoodNotOutstanding');
    });

    it('should not mark food prepared twice', function() {
        const testFood1 = createTestFood1();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1, testFood1]
        }), foodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood1.menuNumber]
        })).when(markFoodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber]
        })).thenFailWith('FoodNotOutstanding');
    });

    it('should serve prepared food', function() {
        const testFood1 = createTestFood1(),
            testFood2 = createTestFood2();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1, testFood1]
        }), foodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).when(markFoodServed({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).then(foodServed({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        }));
    });

    it('should not serve prepared food twice', function() {
        const testFood1 = createTestFood1(),
            testFood2 = createTestFood2();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1, testFood2]
        }), foodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        }), foodServed({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).when(markFoodServed({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).thenFailWith('FoodNotPrepared');

    });

    it('should not serve unordered food', function() {
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [createTestFood1()]
        })).when(markFoodServed({
            tabId: testId,
            menuNumbers: [createTestFood2().menuNumber]
        })).thenFailWith('FoodNotPrepared');
    });

    it('should not serve ordered but unprepared food', function() {
        const testFood1 = createTestFood1(),
            testFood2 = createTestFood2();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1, testFood2]
        })).when(markFoodServed({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).thenFailWith('FoodNotPrepared');
    });

    it('should close tab with exact amount', function() {
        const testFood1 = createTestFood1(),
            testFood2 = createTestFood2();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1, testFood2]
        }), foodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        }), foodServed({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).when(closeTab({
            tabId: testId,
            amountPaid: testFood1.price + testFood2.price
        })).then(tabClosed({
            tabId: testId,
            amountPaid: testFood1.price + testFood2.price,
            orderValue: testFood1.price + testFood2.price,
            tipValue: 0.0
        }));
    });

    it('should close tab with tip', function() {
        const testDrink2 = createTestDrink2();
        given(testTabOpened(), drinksOrdered({
            tabId: testId,
            items: [testDrink2]
        }), drinksServed({
            tabId: testId,
            menuNumbers: [testDrink2.menuNumber]
        })).when(closeTab({
            tabId: testId,
            amountPaid: testDrink2.price + 0.5
        })).then(tabClosed({
            tabId: testId,
            amountPaid: testDrink2.price + 0.5,
            orderValue: testDrink2.price,
            tipValue: 0.5
        }));
    });

    it('should pay enough to close tab', function() {
        const testDrink2 = createTestDrink2();
        given(testTabOpened(), drinksOrdered({
            tabId: testId,
            items: [testDrink2]
        }), drinksServed({
            tabId: testId,
            menuNumbers: [testDrink2.menuNumber]
        })).when(closeTab({
            tabId: testId,
            amountPaid: testDrink2.price - 0.5
        })).thenFailWith('MustPayEnough')
    });

    it('should not close tab twice', function() {
        const testDrink2 = createTestDrink2();
        given(testTabOpened(), drinksOrdered({
            tabId: testId,
            items: [testDrink2]
        }), drinksServed({
            tabId: testId,
            menuNumbers: [testDrink2.menuNumber]
        }), tabClosed({
            tabId: testId,
            amountPaid: testDrink2.price + 0.5,
            orderValue: testDrink2.price,
            tipValue: 0.5
        })).when(closeTab({
            tabId: testId,
            amountPaid: testDrink2.price + 0.5
        })).thenFailWith('TabNotOpen');
    });

    it('should not close tab with unserved drinks', function() {
        const testDrink2 = createTestDrink2();
        given(testTabOpened(), drinksOrdered({
            tabId: testId,
            items: [testDrink2]
        })).when(closeTab({
            tabId: testId,
            amountPaid: testDrink2.price
        })).thenFailWith('TabHasUnservedItems');
    });

    it('should not close tab with unprepared food', function() {
        const testFood1 = createTestFood1();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1]
        })).when(closeTab({
            tabId: testId,
            amountPaid: testFood1.price
        })).thenFailWith('TabHasUnservedItems');
    });

    it('should not close tab with unserved food', function() {
        const testFood1 = createTestFood1();
        given(testTabOpened(), foodOrdered({
            tabId: testId,
            items: [testFood1]
        }), foodPrepared({
            tabId: testId,
            menuNumbers: [testFood1.menuNumber]
        })).when(closeTab({
            tabId: testId,
            amountPaid: testFood1.price
        })).thenFailWith('TabHasUnservedItems');
    });
});
