'use strict';

module.exports = {
    openTab: function(options) {
        return {
            type: 'openTab',
            tabId: options.tabId,
            tableNumber: options.tableNumber,
            waiter: options.waiter
        };
    },
    placeOrder: function(options) {
        return {
            type: 'placeOrder',
            tabId: options.tabId,
            items: options.items
        };
    },
    markDrinksServed: function(options) {
        return {
            type: 'markDrinksServed',
            tabId: options.tabId,
            menuNumbers: options.menuNumbers
        };
    },
    markFoodPrepared: function(options) {
        return {
            type: 'markFoodPrepared',
            tabId: options.tabId,
            menuNumbers: options.menuNumbers
        };
    },
    markFoodServed: function(options) {
        return {
            type: 'markFoodServed',
            tabId: options.tabId,
            menuNumbers: options.menuNumbers
        };
    },
    closeTab: function(options) {
        return {
            type: 'closeTab',
            tabId: options.tabId,
            amountPaid: options.amountPaid
        };
    }
};
