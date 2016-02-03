'use strict';

module.exports = {
    tabOpened: function(options) {
        return {
            type: 'tabOpened',
            tabId: options.tabId,
            tableNumber: options.tableNumber,
            waiter: options.waiter
        };
    },
    drinksOrdered: function(options) {
        return {
            type: 'drinksOrdered',
            tabId: options.tabId,
            items: options.items
        };
    },
    foodOrdered: function(options) {
        return {
            type: 'foodOrdered',
            tabId: options.tabId,
            items: options.items
        };
    },
    drinksServed: function(options) {
        return {
            type: 'drinksServed',
            tabId: options.tabId,
            menuNumbers: options.menuNumbers
        };
    },
    foodPrepared: function(options) {
        return {
            type: 'foodPrepared',
            tabId: options.tabId,
            menuNumbers: options.menuNumbers
        };
    },
    foodServed: function(options) {
        return {
            type: 'foodServed',
            tabId: options.tabId,
            menuNumbers: options.menuNumbers
        };
    },
    tabClosed: function(options) {
        return {
            type: 'tabClosed',
            tabId: options.tabId,
            amountPaid: options.amountPaid,
            orderValue: options.orderValue,
            tipValue: options.tipValue
        };
    }
};
