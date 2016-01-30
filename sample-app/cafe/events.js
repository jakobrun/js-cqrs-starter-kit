'use strict';

module.exports = {
    tabOpened: function(options) {
        return {
            type: 'tabOpened',
            tableNumber: options.tableNumber,
            waiter: options.waiter
        }
    },
    drinksOrdered: function(options) {
        return {
            type: 'drinksOrdered',
            items: options.items
        }
    }
}
