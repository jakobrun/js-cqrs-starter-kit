'use strict';

module.exports = {
    tabOpened: function(options) {
        return {
            type: 'tabOpened',
            tableNumber: options.tableNumber,
            waiter: options.waiter
        };
    },
    drinksOrdered: function(options) {
        return {
            type: 'drinksOrdered',
            items: options.items
        };
    },
    foodOrdered: function(options) {
        return {
            type: 'foodOrdered',
            items: options.items
        };
    },
    drinksServed: function(options) {
        return {
            type: 'drinksServed',
            menuNumbers: options.menuNumbers
        };
    },
    foodPrepared: function(options) {
        return {
            type: 'foodPrepared',
            menuNumbers: options.menuNumbers
        };
    },
    foodServed: function(options) {
        return {
            type: 'foodServed',
            menuNumbers: options.menuNumbers
        };
    }
}
