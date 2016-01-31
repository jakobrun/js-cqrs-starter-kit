'use strict';
const {given} = require('./bdd');
const {openTab, placeOrder, markDrinksServed, markFoodPrepared, markFoodServed} = require('../cafe/commands');
const {tabOpened, drinksOrdered, foodOrdered, drinksServed, foodPrepared, foodServed} = require('../cafe/events');
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

function createTestFood2() {
    return {
        menuNumber: 25,
        description: 'Vegetable Curry',
        price: 6.0,
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

    it('should mark food prepared', function() {
        const testFood1 = createTestFood1();
        given(testTabOpened(), foodOrdered({
            items: [testFood1, testFood1]
        })).when(markFoodPrepared({
            menuNumbers: [testFood1.menuNumber, testFood1.menuNumber]
        })).then(foodPrepared({
            menuNumbers: [testFood1.menuNumber, testFood1.menuNumber]
        }))
    });

    it('should not mark food prepared if it has not been ordered', function() {
        given(testTabOpened()).when(markFoodPrepared({
            menuNumbers: [createTestFood2()]
        })).thenFailWith('FoodNotOutstanding');
    });

    it('should not mark food prepared twice', function() {
        const testFood1 = createTestFood1();
        given(testTabOpened(), foodOrdered({
            items: [testFood1, testFood1]
        }), foodPrepared({
            menuNumbers: [testFood1.menuNumber, testFood1.menuNumber]
        })).when(markFoodPrepared({
            menuNumbers: [testFood1.menuNumber]
        })).thenFailWith('FoodNotOutstanding');
    });

    it('should serve prepared food', function() {
        const testFood1 = createTestFood1(),
            testFood2 = createTestFood2();
        given(testTabOpened(), foodOrdered({
            items: [testFood1, testFood1]
        }), foodPrepared({
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).when(markFoodServed({
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).then(foodServed({
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        }));
    });

    it('should not serve prepared food twice', function() {
        const testFood1 = createTestFood1(),
            testFood2 = createTestFood2();
        given(testTabOpened(), foodOrdered({
            items: [testFood1, testFood2]
        }), foodPrepared({
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        }), foodServed({
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).when(markFoodServed({
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).thenFailWith('FoodNotPrepared');

    });

    it('should not serve unordered food', function() {
        given(testTabOpened(), foodOrdered({
            items: [createTestFood1()]
        })).when(markFoodServed({
            menuNumbers: [createTestFood2().menuNumber]
        })).thenFailWith('FoodNotPrepared');
    });

    it('should not serve ordered but unprepared food', function() {
        const testFood1 = createTestFood1(),
            testFood2 = createTestFood2();
        given(testTabOpened(), foodOrdered({
            items: [testFood1, testFood2]
        })).when(markFoodServed({
            menuNumbers: [testFood1.menuNumber, testFood2.menuNumber]
        })).thenFailWith('FoodNotPrepared');
    });
});
