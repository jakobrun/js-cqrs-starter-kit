'use strict';

module.exports = {
    openTab: function(options) {
        return {
            type: 'openTab',
            tableNumber: options.tableNumber,
            waiter: options.waiter
        };
    },
    placeOrder: function(options) {
        return {
            type: 'placeOrder',
            items: options.items
        };
    },
    markDrinksServed: function(options) {
        return {
            type: 'markDrinksServed',
            menuNumbers: options.menuNumbers
        };
    },
    markFoodPrepared: function(options) {
        return {
            type: 'markFoodPrepared',
            menuNumbers: options.menuNumbers
        };
    },
    markFoodServed: function(options) {
        return {
            type: 'markFoodServed',
            menuNumbers: options.menuNumbers
        };
    }
};
