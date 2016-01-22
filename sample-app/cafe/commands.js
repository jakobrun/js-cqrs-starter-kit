'use strict';

module.exports = {
    openTab: function(options) {
        return {
            tableNumber: options.tableNumber,
            waiter: options.waiter
        };
    }
};
